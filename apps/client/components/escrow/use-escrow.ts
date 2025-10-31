import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import * as anchor from "@coral-xyz/anchor";

import { TimeLockedEscrow } from "@/contract/types/time_locked_escrow";
import idl from "@/contract/idl/time_locked_escrow.json";
import { useConnection } from "../solana/solana-provider";
import { useAnchorWallet } from "../solana/use-anchor-wallet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logger } from "@/utils/logger.service";

const ESCROW_PROGRAM_ID = "CsDdFwNH8mW29B5LMq2VnBfENw7e6VrWVMygEMMMSpsM";

interface EscrowData {
  user: PublicKey;
  amount: BN;
  unlockTime: BN;
  escrowId: BN;
  bump: number;
}

export function useEscrow() {
  const connection = useConnection();
  const anchorWallet = useAnchorWallet();

  const programId = useMemo(() => {
    return new PublicKey(ESCROW_PROGRAM_ID);
  }, []);

  const provider = useMemo(() => {
    if (!anchorWallet) {
      return;
    }
    return new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: "confirmed",
      commitment: "processed",
    });
  }, [anchorWallet, connection]);

  const program = useMemo(() => {
    if (!provider) {
      return;
    }

    return new Program<TimeLockedEscrow>(
      idl as TimeLockedEscrow,
      provider
    );
  }, [provider]);

  // Get UserState PDA
  const getUserStatePDA = (userPubkey?: PublicKey) => {
    const user = userPubkey || anchorWallet?.publicKey;
    if (!user) {
      throw new Error("User public key not available");
    }
    
    const userStateSeed = anchor.utils.bytes.utf8.encode("user_state");
    return anchor.web3.PublicKey.findProgramAddressSync(
      [userStateSeed, user.toBuffer()],
      programId
    );
  };

  // Get Escrow PDA for a specific escrow_id
  const getEscrowPDA = (escrowId: BN, userPubkey?: PublicKey) => {
    const user = userPubkey || anchorWallet?.publicKey;
    if (!user) {
      throw new Error("User public key not available");
    }
    
    const escrowSeed = anchor.utils.bytes.utf8.encode("escrow");
    return anchor.web3.PublicKey.findProgramAddressSync(
      [escrowSeed, user.toBuffer(), escrowId.toArrayLike(Buffer, "le", 8)],
      programId
    );
  };

  // Fetch UserState to get escrow_count
  const userState = useQuery({
    queryKey: ["user-state", anchorWallet?.publicKey?.toString()],
    queryFn: async () => {
      if (!connection || !anchorWallet) {
        return null;
      }

      try {
        const [userStatePDA] = getUserStatePDA();
        const accountInfo = await connection.getAccountInfo(userStatePDA);
        
        if (!accountInfo) {
          return { escrowCount: new BN(0) };
        }
        
        const dataBuffer = Buffer.from(accountInfo.data);
        let offset = 8; // Skip discriminator
        
        // Read escrow_count (u64, 8 bytes)
        const countLow = dataBuffer.readUInt32LE(offset);
        const countHigh = dataBuffer.readUInt32LE(offset + 4);
        const escrowCount = new BN(countLow).add(new BN(countHigh).shln(32));
        
        return { escrowCount };
      } catch (error: any) {
        logger.error("userState.fetch", "Failed to fetch user state", error.message);
        return { escrowCount: new BN(0) };
      }
    },
    enabled: !!connection && !!anchorWallet,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
  });

  // Fetch all escrows for the user
  const escrowAccounts = useQuery({
    queryKey: ["escrow-accounts", anchorWallet?.publicKey?.toString(), userState.data?.escrowCount?.toString()],
    queryFn: async () => {
      if (!connection || !anchorWallet || !userState.data) {
        return [];
      }

      const escrows: EscrowData[] = [];
      const escrowCount = userState.data.escrowCount.toNumber();

      for (let i = 0; i < escrowCount; i++) {
        try {
          const currentEscrowId = new BN(i);
          const [escrowPDA] = getEscrowPDA(currentEscrowId);
          const accountInfo = await connection.getAccountInfo(escrowPDA);
          if (!accountInfo) {
            continue;
          }
          
          const dataBuffer = Buffer.from(accountInfo.data);
          let offset = 8; // Skip discriminator
          
          // Read user (32 bytes)
          const userBytes = dataBuffer.slice(offset, offset + 32);
          const user = new PublicKey(userBytes);
          offset += 32;
          
          // Read amount (u64, 8 bytes)
          const amountLow = dataBuffer.readUInt32LE(offset);
          const amountHigh = dataBuffer.readUInt32LE(offset + 4);
          const amount = new BN(amountLow).add(new BN(amountHigh).shln(32));
          offset += 8;
          
          // Read unlock_time (i64, 8 bytes)
          const unlockTimeLow = dataBuffer.readUInt32LE(offset);
          const unlockTimeHigh = dataBuffer.readInt32LE(offset + 4);
          const unlockTime = new BN(unlockTimeLow).add(new BN(unlockTimeHigh).shln(32));
          offset += 8;
          
          // Read escrow_id (u64, 8 bytes)
          const escrowIdLow = dataBuffer.readUInt32LE(offset);
          const escrowIdHigh = dataBuffer.readUInt32LE(offset + 4);
          const fetchedEscrowId = new BN(escrowIdLow).add(new BN(escrowIdHigh).shln(32));
          offset += 8;
          
          // Read bump (u8, 1 byte)
          const bump = dataBuffer.readUInt8(offset);
          
          escrows.push({
            user,
            amount,
            unlockTime,
            escrowId: fetchedEscrowId,
            bump,
          });
        } catch (error: any) {
          logger.error("escrowAccounts.fetch", `Failed to fetch escrow ${i}`, error.message);
        }
      }

      return escrows;
    },
    enabled: !!connection && !!anchorWallet && !!userState.data,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    notifyOnChangeProps: ['data', 'error'], // Only re-render when data or error changes
  });

  const initializeEscrow = useMutation({
    mutationKey: ["escrow", "initialize"],
    mutationFn: async ({
      amount,
      lockDurationSeconds,
    }: {
      amount: number;
      lockDurationSeconds: number;
    }) => {
      if (!program || !anchorWallet) {
        throw Error("Program not instantiated or wallet not connected");
      }

      // Get current escrow_count from UserState
      const [userStatePDA] = getUserStatePDA();
      let currentEscrowCount = new BN(0);
      
      try {
        const accountInfo = await connection.getAccountInfo(userStatePDA);
        if (accountInfo) {
          const dataBuffer = Buffer.from(accountInfo.data);
          let offset = 8;
          const countLow = dataBuffer.readUInt32LE(offset);
          const countHigh = dataBuffer.readUInt32LE(offset + 4);
          currentEscrowCount = new BN(countLow).add(new BN(countHigh).shln(32));
        }
      } catch (error) {
        // UserState doesn't exist yet, will be created with escrow_count = 0
      }

      const escrowId = currentEscrowCount;
      const [escrowPDA] = getEscrowPDA(escrowId);

      return await program.methods
        .initializeEscrow(escrowId, new BN(amount), new BN(lockDurationSeconds))
        .accountsPartial({
          user: anchorWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature: string) => {
      logger.info(`Escrow initialized: ${signature}`);
      userState.refetch();
      escrowAccounts.refetch();
      return signature;
    },
    onError: (error: Error) => {
      logger.error("initializeEscrow", "Failed to initialize escrow", error.message);
      throw error;
    },
  });

  const withdraw = useMutation({
    mutationKey: ["escrow", "withdraw"],
    mutationFn: async (escrowId: BN) => {
      if (!program || !anchorWallet) {
        throw Error("Program not instantiated or wallet not connected");
      }

      const [escrowPDA] = getEscrowPDA(escrowId);

      return await program.methods
        .withdraw()
        .accountsPartial({
          escrow: escrowPDA,
          user: anchorWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature: string) => {
      logger.info(`Withdrawal successful: ${signature}`);
      escrowAccounts.refetch();
      return signature;
    },
    onError: (error: Error) => {
      logger.error("withdraw", "Failed to withdraw", error.message);
      throw error;
    },
  });

  const closeEscrow = useMutation({
    mutationKey: ["escrow", "close"],
    mutationFn: async (escrowId: BN) => {
      if (!program || !anchorWallet) {
        throw Error("Program not instantiated or wallet not connected");
      }

      const [escrowPDA] = getEscrowPDA(escrowId);

      return await program.methods
        .closeEscrow()
        .accountsPartial({
          escrow: escrowPDA,
          user: anchorWallet.publicKey,
        })
        .rpc();
    },
    onSuccess: (signature: string) => {
      logger.info(`Escrow closed: ${signature}`);
      escrowAccounts.refetch();
      return signature;
    },
    onError: (error: Error) => {
      logger.error("closeEscrow", "Failed to close escrow", error.message);
      throw error;
    },
  });

  return {
    program,
    programId,
    getUserStatePDA,
    getEscrowPDA,
    userState,
    escrowAccounts,
    initializeEscrow,
    withdraw,
    closeEscrow,
  };
}
