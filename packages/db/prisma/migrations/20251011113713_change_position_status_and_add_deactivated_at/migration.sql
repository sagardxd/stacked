/*
  Warnings:

  - The values [EXPIRED] on the enum `PositionStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[seed]` on the table `Position` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stakeAccountPubkey]` on the table `Position` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PositionStatus_new" AS ENUM ('PENDING', 'ACTIVATING', 'ACTIVE', 'DEACTIVATING', 'INACTIVE', 'CLOSED', 'FAILED');
ALTER TABLE "public"."Position" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Position" ALTER COLUMN "status" TYPE "PositionStatus_new" USING ("status"::text::"PositionStatus_new");
ALTER TYPE "PositionStatus" RENAME TO "PositionStatus_old";
ALTER TYPE "PositionStatus_new" RENAME TO "PositionStatus";
DROP TYPE "public"."PositionStatus_old";
ALTER TABLE "Position" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "deactivatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Position_seed_key" ON "Position"("seed");

-- CreateIndex
CREATE UNIQUE INDEX "Position_stakeAccountPubkey_key" ON "Position"("stakeAccountPubkey");
