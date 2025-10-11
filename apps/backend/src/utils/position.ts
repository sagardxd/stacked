import type { PositionStatus } from "@repo/db";
import { type Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import type { Contracts } from "../../../../contracts/target/types/contracts";

export async function waitForSignature(
  connection: Connection,
  signature: string,
  timeoutMs = 90_000,
  pollIntervalMs = 1500
) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const resp = await connection.getSignatureStatuses([signature]);
    const status = resp?.value?.[0];
    if (status) return status;
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }
  throw new Error("signature_confirm_timeout");
}


export function activationStateToPositionStatus(state: string | null): PositionStatus {
  if (!state) return "PENDING";
  if (state === "activating") return "ACTIVATING";
  if (state === "active") return "ACTIVE";
  if (state === "deactivating") return "DEACTIVATING";
  if (state === "inactive") return "INACTIVE";
  return "PENDING";
}

export async function deriveAddress(owner: PublicKey, seed: string, program: anchor.Program<Contracts>) {
  const stackAccount = await PublicKey.createWithSeed(
    owner,
    seed,
    program.programId
  );
  const [positionPda, positionBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("position"), stackAccount.toBuffer()],
    program.programId
  );
  const [stackAuthPda, stackAuthBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("stake-authority")],
    program.programId
  );
  return {
    stackAccount,
    positionPda,
    positionBump,
    stackAuthPda,
    stackAuthBump,
  };
}