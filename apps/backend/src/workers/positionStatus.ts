import { prisma } from "@repo/db";
import { getStakeActivation } from "@anza-xyz/solana-rpc-get-stake-activation";
import { PublicKey } from "@solana/web3.js";
import { activationStateToPositionStatus } from "../utils/position";
import { connection } from "../utils/anchor";

export async function updatePositionStatus() {
  try {
    const items = await prisma.position.findMany({
      where: { status: { in: ["PENDING", "ACTIVATING", "DEACTIVATING"] } },
      take: 100,
    });

    for (const item of items) {
      const activation = await getStakeActivation(
        connection,
        new PublicKey(item.stakeAccountPubkey!)
      );
      if (!activation) {
        await prisma.position.update({
          where: { id: item.id },
          data: { status: "CLOSED" },
        });
        continue;
      }
      const status = activationStateToPositionStatus(activation.status);

      await prisma.position.update({
        where: { id: item.id },
        data: {
          status,
          activeAt: status === "ACTIVE" ? new Date() : item.activeAt,
        },
      });
    }
  } catch (error: any) {
    console.error("Error updating position statuses:", error);
  }
}
