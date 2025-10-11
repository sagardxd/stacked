
import * as anchor from "@coral-xyz/anchor";
import { config } from "@repo/config";
import idl from "../../../../contracts/target/idl/contracts.json";
import type { Contracts } from "../../../../contracts/target/types/contracts";

export const connection = new anchor.web3.Connection(
  config.DEVNET_RPC_URL!,
  "confirmed"
);

export const provider = new anchor.AnchorProvider(connection, null as any, {
  commitment: "confirmed",
});

export const program = new anchor.Program<Contracts>(
  idl as Contracts,
  provider
);
