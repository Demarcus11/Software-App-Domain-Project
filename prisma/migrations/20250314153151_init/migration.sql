/*
  Warnings:

  - You are about to drop the column `accountDescription` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `accountName` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `accountNumber` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `credit` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `debit` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `credit` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `debit` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creditAccountId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debitAccountId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_accountId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_userId_fkey";

-- DropIndex
DROP INDEX "accounts_accountName_key";

-- DropIndex
DROP INDEX "accounts_accountNumber_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "accountDescription",
DROP COLUMN "accountName",
DROP COLUMN "accountNumber",
DROP COLUMN "balance",
DROP COLUMN "credit",
DROP COLUMN "debit",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "accountId",
DROP COLUMN "balance",
DROP COLUMN "credit",
DROP COLUMN "debit",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "creditAccountId" INTEGER NOT NULL,
ADD COLUMN     "debitAccountId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_name_key" ON "accounts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_number_key" ON "accounts"("number");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_debitAccountId_fkey" FOREIGN KEY ("debitAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_creditAccountId_fkey" FOREIGN KEY ("creditAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
