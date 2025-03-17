/*
  Warnings:

  - Added the required column `normalSide` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `subcategories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "normalSide" TEXT NOT NULL,
ADD COLUMN     "totalCredits" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "totalDebits" DOUBLE PRECISION NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "subcategories" ADD COLUMN     "categoryId" INTEGER NOT NULL;
