use anchor_lang::prelude::*;
use anchor_lang::system_program;


declare_id!("DCeZL4KzUhkEqefebaw3nCTCtEo58n4Dz8C8GWNWebG6");

#[program]
pub mod time_locked_escrow {
    use super::*;

    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        amount: u64,
        lock_duration_seconds: i64,
    ) -> Result<()> {
        let clock = Clock::get()?;

        require!(amount > 0, EscrowError::InvalidAmount);
        require!(lock_duration_seconds > 0, EscrowError::InvalidDuration);

        // Transfer SOL from user to escrow PDA first
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.escrow.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        // Initialize escrow state (account already created by 'init')
        let escrow = &mut ctx.accounts.escrow;
        escrow.user = ctx.accounts.user.key();
        escrow.amount = amount;
        escrow.unlock_time = clock.unix_timestamp + lock_duration_seconds;
        escrow.bump = ctx.bumps.escrow;

        msg!("Escrow initialized!");
        msg!("Amount locked: {} lamports", amount);
        msg!("Unlock time: {}", escrow.unlock_time);

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let clock = Clock::get()?;
        let escrow = &ctx.accounts.escrow;

        // Check if unlock time has passed
        require!(
            clock.unix_timestamp >= escrow.unlock_time,
            EscrowError::StillLocked
        );

        // Check if there are funds to withdraw
        require!(escrow.amount > 0, EscrowError::NoFundsToWithdraw);

        let amount = escrow.amount;
        let user_key = escrow.user;
        let bump = escrow.bump;

        // Transfer SOL back to user
        let seeds = &[
            b"escrow",
            user_key.as_ref(),
            &[bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.escrow.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
            },
            signer_seeds,
        );
        system_program::transfer(cpi_context, amount)?;

        // Update state to reflect withdrawal
        ctx.accounts.escrow.amount = 0;

        msg!("Withdrawal successful!");
        msg!("Amount withdrawn: {} lamports", amount);

        Ok(())
    }

    pub fn close_escrow(ctx: Context<CloseEscrow>) -> Result<()> {
        let escrow = &ctx.accounts.escrow;
        let clock = Clock::get()?;

        // Ensure time has passed
        require!(
            clock.unix_timestamp >= escrow.unlock_time,
            EscrowError::StillLocked
        );

        // Ensure all funds have been withdrawn
        require!(
            escrow.amount == 0,
            EscrowError::MustWithdrawFirst
        );

        msg!("Escrow closed successfully!");

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEscrow<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Escrow::INIT_SPACE,
        seeds = [b"escrow", user.key().as_ref()],
        bump
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"escrow", user.key().as_ref()],
        bump = escrow.bump,
        has_one = user
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", user.key().as_ref()],
        bump = escrow.bump,
        has_one = user,
        close = user
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub user: Pubkey,           // 32 bytes
    pub amount: u64,            // 8 bytes
    pub unlock_time: i64,       // 8 bytes
    pub bump: u8,               // 1 byte
}

#[error_code]
pub enum EscrowError {
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("Lock duration must be greater than 0")]
    InvalidDuration,
    #[msg("Funds are still locked. Please wait until unlock time.")]
    StillLocked,
    #[msg("No funds available to withdraw")]
    NoFundsToWithdraw,
    #[msg("Must withdraw funds before closing escrow")]
    MustWithdrawFirst,
}