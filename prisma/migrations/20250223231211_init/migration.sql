/*
  Warnings:

  - You are about to drop the column `suspendedUntil` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "suspendedUntil",
ADD COLUMN     "suspensionEnd" TIMESTAMP(3),
ADD COLUMN     "suspensionStart" TIMESTAMP(3);
