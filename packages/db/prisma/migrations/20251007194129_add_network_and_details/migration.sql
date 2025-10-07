/*
  Warnings:

  - Added the required column `network` to the `Validator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Validator" ADD COLUMN     "details" TEXT,
ADD COLUMN     "network" TEXT NOT NULL;
