use anchor_lang::{accounts::signer, prelude::*};

declare_id!("DKzf13FTkMC2p2UxqL3s4UEp5V3BFGNid2HGhkq9NBJu");

#[program]
pub mod contracts {
    use anchor_lang::{
        solana_program::{
            clock, program::invoke_signed, stake::instruction, sysvar::stake_history::StakeHistory,
        },
        system_program,
    };

    use super::*;

    pub fn create_position(
        ctx: Context<CreatePosition>,
        position_id: [u8; 32],
        lock_duration: u64,
        transferable: bool,
    ) -> Result<()> {
        let position = &mut ctx.accounts.position;
        let clock = Clock::get()?;
        let bumps = ctx.bumps;

        position.position_id = position_id;
        position.owner = ctx.accounts.owner.key();
        position.validator = ctx.accounts.validator.key();
        position.amount = ctx.accounts.stake_account.to_account_info().lamports();
        position.for_sale = false;
        position.start_ts = clock.unix_timestamp as u64;
        position.maturity_ts = lock_duration;
        position.transferable = transferable;
        position.listed_price = 0;
        position.position_bump = bumps.position;
        position.stake_authority_bump = bumps.stake_authority;

        require_keys_eq!(
            *ctx.accounts.stake_account.owner,
            ctx.accounts.stake_program.key()
        );

        let stake_acc = ctx.accounts.stake_account.to_account_info();
        let stake_auth = ctx.accounts.stake_authority.to_account_info();
        let validator_acc = ctx.accounts.validator.to_account_info();
        let stake_history = ctx.accounts.stake_history.to_account_info();
        let stake_config = ctx.accounts.stake_config.to_account_info();
        let stake_program_acc = ctx.accounts.stake_program.to_account_info();
        let clock_acc = ctx.accounts.clock.to_account_info();
        let position_key = position.key();

        let delegate =
            instruction::delegate_stake(&stake_acc.key(), &stake_auth.key(), &validator_acc.key());
        let signer_seeds: &[&[u8]] = &[
            b"stake-authority",
            position_key.as_ref(),
            &[position.stake_authority_bump],
        ];

        invoke_signed(
            &delegate,
            &[
                stake_acc,
                validator_acc,
                stake_auth,
                clock_acc,
                stake_history,
                stake_config,
                stake_program_acc,
            ],
            &[signer_seeds],
        )?;

        Ok(())
    }

    pub fn list_for_sale(ctx: Context<ListForSale>, price: u64) -> Result<()> {
        let position = &mut ctx.accounts.position;
        require!(
            position.owner == ctx.accounts.owner.key(),
            ErrorCode::Unauthorized
        );
        require!(position.transferable == true, ErrorCode::NotForSale);

        position.for_sale = true;
        position.listed_price = price;

        Ok(())
    }

    pub fn cancel_sale(ctx: Context<CancelSale>) -> Result<()> {
        let pos = &mut ctx.accounts.position;

        pos.for_sale = false;
        pos.listed_price = 0;

        Ok(())
    }

    pub fn buy_position(ctx: Context<BuyPosition>) -> Result<()> {
        let pos = &mut ctx.accounts.position;
        require!(pos.for_sale, ErrorCode::NotForSale);
        require!(pos.transferable, ErrorCode::NotTransferable);

        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.seller.to_account_info(),
            },
        );
        system_program::transfer(cpi_ctx, pos.listed_price)?;

        pos.owner = ctx.accounts.buyer.key();
        pos.for_sale = false;
        pos.listed_price = 0;

        Ok(())
    }

    pub fn deactivate(ctx: Context<Deactivate>) -> Result<()> {
        let pos = &mut ctx.accounts.position;
        require!(
            pos.owner == ctx.accounts.owner.key(),
            ErrorCode::Unauthorized
        );

        let stack_acc = ctx.accounts.stake_account.to_account_info();
        let stack_auth = ctx.accounts.stake_authority.to_account_info();
        let stact_program_acc = ctx.accounts.stack_program.to_account_info();
        let clock = Clock::get()?;
        let position_key = pos.key();

        let deactivate = instruction::deactivate_stake(&stack_acc.key(), &stack_auth.key());
        let signer_seeds: &[&[u8]] = &[
            b"stake-authority",
            position_key.as_ref(),
            &[pos.stake_authority_bump],
        ];

        invoke_signed(
            &deactivate,
            &[stack_acc, stack_auth, stact_program_acc],
            &[signer_seeds],
        )?;

        pos.deactivated_at = Some(clock.unix_timestamp as u64);

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let pos = &mut ctx.accounts.position;
        require!(
            pos.owner == ctx.accounts.owner.key(),
            ErrorCode::Unauthorized
        );

        let clock = Clock::get()?;
        let now_u64 = clock.unix_timestamp as u64;
        let unlock_time = pos
            .start_ts
            .checked_add(pos.maturity_ts)
            .ok_or(error!(ErrorCode::ArithmeticOverflow))?;
        require!(
            now_u64 >= unlock_time || pos.deactivated_at.is_some(),
            ErrorCode::NotMature
        );

        let stake_acc = ctx.accounts.stake_account.to_account_info();
        let stake_auth = ctx.accounts.stake_authority.to_account_info();
        let stake_program_acc = ctx.accounts.stake_program.to_account_info();
        let position_key = pos.key();
        let clock = ctx.accounts.clock.to_account_info();

        let withdraw = instruction::withdraw(
            &stake_acc.key(),
            &stake_auth.key(),
            &pos.owner,
            pos.amount,
            Some(&clock.key()),
        );
        let signer_seeds: &[&[u8]] = &[
            b"stake-authority",
            position_key.as_ref(),
            &[pos.stake_authority_bump],
        ];

        invoke_signed(
            &withdraw,
            &[stake_acc, stake_auth, clock, stake_program_acc],
            &[signer_seeds],
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(position_id: Pubkey)]
pub struct CreatePosition<'info> {
    #[account(init, payer = owner, space = 8  + Position::INIT_SPACE, seeds = [b"position", position_id.as_ref()], bump)]
    pub position: Account<'info, Position>,

    /// CHECK: stake_account is created by the user and must be a valid stake account
    #[account(mut)]
    pub stake_account: UncheckedAccount<'info>,

    /// CHECK: stake_authority is a PDA
    #[account(seeds = [b"stake-authority", position.key().as_ref()], bump)]
    pub stake_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,

    /// CHECK: validator is the expected validator vote account
    pub validator: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,

    /// CHECK: stake_program is the expected stake program id
    pub stake_program: UncheckedAccount<'info>,
    pub clock: Sysvar<'info, Clock>,
    pub stake_history: Sysvar<'info, StakeHistory>,
    /// CHECK: stake_config is the expected stake config program id
    pub stake_config: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct ListForSale<'info> {
    #[account(mut, has_one = owner)]
    pub position: Account<'info, Position>,

    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct CancelSale<'info> {
    #[account(mut, has_one = owner)]
    pub position: Account<'info, Position>,

    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct BuyPosition<'info> {
    #[account(mut)]
    pub position: Account<'info, Position>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK: seller is the current owner of the position
    #[account(mut)]
    pub seller: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deactivate<'info> {
    #[account(mut, has_one = owner)]
    pub position: Account<'info, Position>,

    /// CHECK: stake_account is the stake account to deactivate
    #[account(mut)]
    pub stake_account: UncheckedAccount<'info>,

    /// CHECK: stake_authority is a PDA
    #[account(seeds = [b"stake-authority", position.key().as_ref()], bump = position.stake_authority_bump)]
    pub stake_authority: UncheckedAccount<'info>,

    pub owner: Signer<'info>,

    /// CHECK: stake_program is the expected stake program id
    pub stack_program: UncheckedAccount<'info>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, has_one = owner)]
    pub position: Account<'info, Position>,

    /// CHECK: stake_account is the stake account to withdraw from
    #[account(mut)]
    pub stake_account: UncheckedAccount<'info>,

    /// CHECK: stake_authority is a PDA
    #[account(seeds = [b"stake-authority", position.key().as_ref()], bump = position.stake_authority_bump)]
    pub stake_authority: UncheckedAccount<'info>,

    pub owner: Signer<'info>,

    /// CHECK: stake_program is the expected stake program id
    pub stake_program: UncheckedAccount<'info>,
    pub clock: Sysvar<'info, Clock>,
}

#[account]
#[derive(InitSpace)]
pub struct Position {
    pub position_id: [u8; 32],
    pub owner: Pubkey,
    pub validator: Pubkey,
    pub amount: u64,
    pub start_ts: u64,
    pub maturity_ts: u64,
    pub transferable: bool,
    pub for_sale: bool,
    pub listed_price: u64,
    pub deactivated_at: Option<u64>,
    pub position_bump: u8,
    pub stake_authority_bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Position is not transferable")]
    NotTransferable,
    #[msg("Position not listed for sale")]
    NotForSale,
    #[msg("Payment failed")]
    PaymentFailed,
    #[msg("Delegate failed")]
    DelegateFailed,
    #[msg("Deactivate failed")]
    DeactivateFailed,
    #[msg("Withdraw failed")]
    WithdrawFailed,
    #[msg("Position not matured yet")]
    NotMature,
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
}
