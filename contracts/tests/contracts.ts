import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contracts } from "../target/types/contracts";
import { parse, v4 as uuidv4 } from "uuid";
import { assert } from "chai";

function derivePositionPda(position_id: string) {
  const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("position"), Buffer.from(parse(position_id))],
    anchor.workspace.contracts.programId
  );
  return { pda, bump };
}

function deriveStakeAuthPda(position_pda: anchor.web3.PublicKey) {
  const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("stake-authority"), position_pda.toBuffer()],
    anchor.workspace.contracts.programId
  );
  return { pda, bump };
}

describe("contracts", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.contracts as Program<Contracts>;

  const user = anchor.web3.Keypair.generate();
  const position_id = uuidv4();
  const { pda, bump } = derivePositionPda(position_id);

  it("Airdrop to test user", async () => {
    const sig = await provider.connection.requestAirdrop(
      user.publicKey,
      2_000_000_000 
    );
    await provider.connection.confirmTransaction(sig);
    const balance = await provider.connection.getBalance(user.publicKey);
    console.log("User balance:", balance / anchor.web3.LAMPORTS_PER_SOL, "SOL");
    assert(balance === 2_000_000_000);
  });

  it("Creates stake account and creates a position", async () => {
    const stakeAccount = anchor.web3.Keypair.generate();
    const stakeAuth = deriveStakeAuthPda(pda);
    const createStakeIx = anchor.web3.StakeProgram.createAccount({
      fromPubkey: user.publicKey,
      stakePubkey: stakeAccount.publicKey,
      authorized: new anchor.web3.Authorized(stakeAuth.pda, stakeAuth.pda),
      lockup: new anchor.web3.Lockup(0, 0, user.publicKey),
      lamports: anchor.web3.LAMPORTS_PER_SOL,
    });

    const txCreateStake = new anchor.web3.Transaction().add(createStakeIx);
    await provider.sendAndConfirm(txCreateStake, [user, stakeAccount]);
    const validatorPubkey = anchor.web3.Keypair.generate().publicKey;
    console.log("Stake account created:", stakeAccount.publicKey.toBase58());
    const tx = await program.methods
      .createPosition(
        Array.from(Buffer.from(position_id.padEnd(32, "\0"))), // positionId as 32-byte array
        new anchor.BN(0), // lockDuration
        false
      )
      .accounts({
        position: pda,
        stakeAccount: stakeAccount.publicKey,
        stakeAuthority: deriveStakeAuthPda(pda).pda,
        owner: user.publicKey,
        validator: validatorPubkey,
        systemProgram: anchor.web3.SystemProgram.programId,
        stakeProgram: anchor.web3.StakeProgram.programId,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      } as any)
      .signers([user])
      .rpc();
    console.log("Your transaction signature", tx);
    const position = await program.account.position.fetch(pda);
    console.log("Position:", position);
  });
});
