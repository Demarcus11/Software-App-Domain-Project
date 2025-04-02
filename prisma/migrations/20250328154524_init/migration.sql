/*
  Warnings:

  - Added the required column `journalEntryId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "journalEntryId" INTEGER NOT NULL;
