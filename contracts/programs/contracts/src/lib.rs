use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod time_lock_escrow {
    use super::*;

    /// Initialize a new time-locked escrow
    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        amount: u64,
        lock_duration_seconds: i64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        require!(lock_duration_seconds > 0, ErrorCode::InvalidDuration);

        let escrow = &mut ctx.accounts.escrow;
        let clock = Clock::get()?;

        escrow.owner = ctx.accounts.owner.key();
        escrow.amount = amount;
        escrow.lock_start = clock.unix_timestamp;
        escrow.lock_duration = lock_duration_seconds;
        escrow.unlock_time = clock.unix_timestamp + lock_duration_seconds;
        escrow.is_withdrawn = false;
        escrow.bump = ctx.bumps.escrow;

        // Transfer SOL from user to escrow PDA
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.owner.to_account_info(),
                to: ctx.accounts.escrow.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        msg!("Escrow initialized!");
        msg!("Owner: {}", escrow.owner);
        msg!("Amount locked: {} lamports", escrow.amount);
        msg!("Lock duration: {} seconds", escrow.lock_duration);
        msg!("Unlock time: {}", escrow.unlock_time);

        Ok(())
    }

    /// Withdraw funds after the lock period has expired
    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let clock = Clock::get()?;

        require!(!escrow.is_withdrawn, ErrorCode::AlreadyWithdrawn);
        require!(
            clock.unix_timestamp >= escrow.unlock_time,
            ErrorCode::StillLocked
        );

        let amount = escrow.amount;
        escrow.is_withdrawn = true;

        // Transfer SOL from escrow PDA back to owner
        **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.owner.to_account_info().try_borrow_mut_lamports()? += amount;

        msg!("Withdrawal successful!");
        msg!("Amount withdrawn: {} lamports", amount);
        msg!("To: {}", ctx.accounts.owner.key());

        Ok(())
    }

    /// Close the escrow account and return rent (only after withdrawal)
    pub fn close_escrow(ctx: Context<CloseEscrow>) -> Result<()> {
        let escrow = &ctx.accounts.escrow;
        
        require!(escrow.is_withdrawn, ErrorCode::NotWithdrawn);

        msg!("Escrow account closed!");
        msg!("Rent returned to: {}", ctx.accounts.owner.key());

        Ok(())
    }

    /// Get escrow information (view function)
    pub fn get_escrow_info(ctx: Context<GetEscrowInfo>) -> Result<()> {
        let escrow = &ctx.accounts.escrow;
        let clock = Clock::get()?;
        
        msg!("=== Escrow Information ===");
        msg!("Owner: {}", escrow.owner);
        msg!("Amount: {} lamports ({} SOL)", escrow.amount, escrow.amount as f64 / 1_000_000_000.0);
        msg!("Lock Start: {}", escrow.lock_start);
        msg!("Lock Duration: {} seconds", escrow.lock_duration);
        msg!("Unlock Time: {}", escrow.unlock_time);
        msg!("Current Time: {}", clock.unix_timestamp);
        msg!("Is Withdrawn: {}", escrow.is_withdrawn);
        
        if !escrow.is_withdrawn {
            let time_remaining = escrow.unlock_time - clock.unix_timestamp;
            if time_remaining > 0 {
                msg!("Time Remaining: {} seconds ({} days)", time_remaining, time_remaining / 86400);
            } else {
                msg!("Status: Ready to withdraw!");
            }
        } else {
            msg!("Status: Already withdrawn");
        }
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEscrow<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Escrow::INIT_SPACE,
        seeds = [b"escrow", owner.key().as_ref()],
        bump
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"escrow", owner.key().as_ref()],
        bump = escrow.bump,
        has_one = owner
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", owner.key().as_ref()],
        bump = escrow.bump,
        has_one = owner,
        close = owner
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetEscrowInfo<'info> {
    #[account(
        seeds = [b"escrow", owner.key().as_ref()],
        bump = escrow.bump,
    )]
    pub escrow: Account<'info, Escrow>,
    
    pub owner: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub owner: Pubkey,           // 32 bytes
    pub amount: u64,             // 8 bytes
    pub lock_start: i64,         // 8 bytes
    pub lock_duration: i64,      // 8 bytes
    pub unlock_time: i64,        // 8 bytes
    pub is_withdrawn: bool,      // 1 byte
    pub bump: u8,                // 1 byte
}

#[error_code]
pub enum ErrorCode {
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    
    #[msg("Lock duration must be greater than 0")]
    InvalidDuration,
    
    #[msg("Funds are still locked. Cannot withdraw yet.")]
    StillLocked,
    
    #[msg("Funds have already been withdrawn")]
    AlreadyWithdrawn,
    
    #[msg("Must withdraw funds before closing escrow")]
    NotWithdrawn,
}