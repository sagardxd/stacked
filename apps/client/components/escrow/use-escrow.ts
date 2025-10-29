import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import * as anchor from "@coral-xyz/anchor";

import { TimeLockedEscrow } from "@/contract/types/time_locked_escrow";
import idl from "@/contract/idl/time_locked_escrow.json";
import { useConnection } from "../solana/solana-provider";
import { useAnchorWallet } from "../solana/use-anchor-wallet";
import { useMutation, useQuery } from "@tanstack/react-query";

const ESCROW_PROGRAM_ID = "DCeZL4KzUhkEqefebaw3nCTCtEo58n4Dz8C8GWNWebG6";

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

  const getEscrowPDA = (userPubkey?: PublicKey) => {
    const user = userPubkey || anchorWallet?.publicKey;
    if (!user) {
      throw new Error("User public key not available");
    }

    const escrowSeed = anchor.utils.bytes.utf8.encode("escrow");
    return anchor.web3.PublicKey.findProgramAddressSync(
      [escrowSeed, user.toBuffer()],
      programId
    );
  };

  // Query to fetch escrow account data
  const escrowAccount = useQuery({
    queryKey: ["escrow-account", anchorWallet?.publicKey?.toString()],
    queryFn: async () => {
      if (!program || !anchorWallet) {
        return null;
      }

      try {
        const [escrowPDA] = getEscrowPDA();
        return await program.account.escrow.fetch(escrowPDA);
      } catch (error) {
        // Account doesn't exist yet
        return null;
      }
    },
    enabled: !!program && !!anchorWallet,
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

      const [escrowPDA] = getEscrowPDA();

      return await program.methods
        .initializeEscrow(new BN(amount), new BN(lockDurationSeconds))
        .accounts({
          user: anchorWallet.publicKey,
        })
        .rpc();
    },
    onSuccess: (signature: string) => {
      console.log("Escrow initialized successfully:", signature);
      escrowAccount.refetch();
      return signature;
    },
    onError: (error: Error) => {
      console.error("Error initializing escrow:", error.message);
      throw error;
    },
  });

  const withdraw = useMutation({
    mutationKey: ["escrow", "withdraw"],
    mutationFn: async () => {
      if (!program || !anchorWallet) {
        throw Error("Program not instantiated or wallet not connected");
      }

      const [escrowPDA] = getEscrowPDA();

      return await program.methods
        .withdraw()
        .accounts({
          user: anchorWallet.publicKey,
        })
        .rpc();
    },
    onSuccess: (signature: string) => {
      console.log("Withdrawal successful:", signature);
      escrowAccount.refetch();
      return signature;
    },
    onError: (error: Error) => {
      console.error("Error withdrawing:", error.message);
      throw error;
    },
  });

  const closeEscrow = useMutation({
    mutationKey: ["escrow", "close"],
    mutationFn: async () => {
      if (!program || !anchorWallet) {
        throw Error("Program not instantiated or wallet not connected");
      }

      const [escrowPDA] = getEscrowPDA();

      return await program.methods
        .closeEscrow()
        .accounts({
          user: anchorWallet.publicKey,
        })
        .rpc();
    },
    onSuccess: (signature: string) => {
      console.log("Escrow closed successfully:", signature);
      escrowAccount.refetch();
      return signature;
    },
    onError: (error: Error) => {
      console.error("Error closing escrow:", error.message);
      throw error;
    },
  });

  return {
    program,
    programId,
    getEscrowPDA,
    escrowAccount,
    initializeEscrow,
    withdraw,
    closeEscrow,
  };
}