/*
  Warnings:

  - You are about to drop the column `suspensionEnd` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `suspensionStart` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "suspensionEnd",
DROP COLUMN "suspensionStart",
ADD COLUMN     "suspendedUntil" TIMESTAMP(3);
