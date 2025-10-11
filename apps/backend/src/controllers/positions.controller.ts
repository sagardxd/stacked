import type { Request, Response } from "express";
import { prisma } from "@repo/db";
import type { ApiResponse } from "@repo/types";
import { logger } from "@repo/config";
import * as anchor from "@coral-xyz/anchor";
import { getStakeActivation } from "@anza-xyz/solana-rpc-get-stake-activation";

import {
  SystemProgram,
  PublicKey,
  StakeProgram,
  Authorized,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_STAKE_HISTORY_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
} from "@solana/web3.js";
import {
  activationStateToPositionStatus,
  deriveAddress,
  waitForSignature,
} from "../utils/position";
import { connection, program } from "../utils/anchor";

export async function getAllPositions(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const positions = await prisma.position.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      data: positions,
    } as ApiResponse<typeof positions>);
  } catch (error: any) {
    logger.error("Error fetching positions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse<null>);
  }
}

export async function createPosition(req: Request, res: Response) {
  try {
    const { validatorVotePubkey, stakeLamports, lockDuration, transferable } =
      req.body;
    if (
      !validatorVotePubkey ||
      !stakeLamports ||
      !lockDuration ||
      !transferable
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      } as ApiResponse<null>);
    }
    const owner = new PublicKey(req.user.walletPubkey);
    const validatorVote = new PublicKey(validatorVotePubkey);
    const seed = `s-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`.slice(0, 32);
    const {
      stackAccount,
      positionPda,
      positionBump,
      stackAuthPda,
      stackAuthBump,
    } = await deriveAddress(owner, seed, program);
    const rentExempt = await connection.getMinimumBalanceForRentExemption(
      StakeProgram.space
    );

    const totalLamports = rentExempt + stakeLamports;

    const createWithSeedIx = StakeProgram.createAccountWithSeed({
      fromPubkey: owner,
      stakePubkey: stackAccount,
      basePubkey: owner,
      seed: seed,
      authorized: new Authorized(stackAuthPda, stackAuthPda),
      lamports: totalLamports,
    });

    const initIx = StakeProgram.initialize({
      stakePubkey: stackAccount,
      authorized: new Authorized(stackAuthPda, stackAuthPda),
    });

    const createPositionIx: TransactionInstruction = await program.methods
      .createPosition(lockDuration, transferable)
      .accountsStrict({
        position: positionPda,
        stakeAccount: stackAccount,
        stakeAuthority: stackAuthPda,
        owner: owner,
        validatorVote: validatorVote,
        systemProgram: SystemProgram.programId,
        stakeProgram: StakeProgram.programId,
        clock: SYSVAR_CLOCK_PUBKEY,
        stakeHistory: SYSVAR_STAKE_HISTORY_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction().add(
      createWithSeedIx,
      initIx,
      createPositionIx
    );

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
    const base64Transaction = serializedTransaction.toString("base64");

    const validator = await prisma.validator.findUnique({
      where: {
        voteAccountPubkey: validatorVote.toBase58(),
      },
    });
    if (!validator) {
      return res.status(400).json({
        success: false,
        message: "Validator not found",
      } as ApiResponse<null>);
    }

    await prisma.position.create({
      data: {
        userId: req.user.id,
        seed,
        stakeAccountPubkey: stackAccount.toBase58(),
        validatorId: validatorVote.toBase58(),
        lamports: stakeLamports,
        status: "PENDING",
        transferable,
        lockedUntil: new Date(Date.now() + lockDuration * 1000),
      },
    });

    res.status(200).json({
      success: true,
      data: {
        transaction: base64Transaction,
        positionPda: positionPda.toBase58(),
      },
    } as ApiResponse<{ transaction: string; positionPda: string }>);
  } catch (error: any) {
    logger.error("Error creating position:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse<null>);
  }
}

export async function verifyPositionTx(req: Request, res: Response) {
  try {
    const { txSignature, stakeAccountPubkey, positionPda } = req.body;
    if (!txSignature || !stakeAccountPubkey || !positionPda) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      } as ApiResponse<null>);
    }

    const txStatus = await waitForSignature(
      connection,
      txSignature,
      90_000,
      1500
    );
    if (txStatus?.err) {
      return res.status(400).json({
        success: false,
        message: "Transaction failed",
      } as ApiResponse<null>);
    }

    let onChainPosition = await program.account.position.fetch(
      new PublicKey(positionPda)
    );

    if (!onChainPosition) {
      return res.status(404).json({
        success: false,
        message: "Position not found on-chain",
      } as ApiResponse<null>);
    }
    const onChainStakeAccount = await connection.getParsedAccountInfo(
      stakeAccountPubkey,
      "confirmed"
    );
    console.log(onChainStakeAccount);

    if (!onChainStakeAccount.value) {
      return res.status(404).json({
        success: false,
        message: "Stake account not found on-chain",
      } as ApiResponse<null>);
    }

    const activation = await getStakeActivation(
      connection,
      new PublicKey(stakeAccountPubkey)
    );
    const status = activationStateToPositionStatus(activation.status);

    const position = await prisma.position.findFirst({
      where: {
        stakeAccountPubkey: stakeAccountPubkey,
        status: "PENDING",
      },
    });

    if (!position) {
      return res.status(404).json({
        success: false,
        message: "Position not found or already confirmed",
      } as ApiResponse<null>);
    }
    await prisma.position.update({
      where: {
        id: position.id,
      },
      data: {
        txSignature,
        status,
        activeAt: status === "ACTIVE" ? new Date() : null,
      },
    });
    res.status(200).json({
      success: true,
      message: "Position confirmed and activated",
    } as ApiResponse<null>);
  } catch (error: any) {
    logger.error("Error verifying position transaction:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse<null>);
  }
}
