import { prisma } from "@repo/db";

export async function startCleanupCron() {
  try {
    await prisma.nonce.deleteMany({
      where: {
        OR: [{ used: true }, { expiresAt: { lt: new Date() } }],
      },
    });
  } catch (error) {
    console.error("Error cleaning up nonces:", error);
  }
}
