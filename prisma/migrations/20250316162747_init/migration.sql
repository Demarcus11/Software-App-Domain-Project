/*
  Warnings:

  - You are about to drop the column `normalSide` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `creditAccountId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `debitAccountId` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_creditAccountId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_debitAccountId_fkey";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "normalSide";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "creditAccountId",
DROP COLUMN "debitAccountId",
ADD COLUMN     "accountId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
