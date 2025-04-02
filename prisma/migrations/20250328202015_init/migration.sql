/*
  Warnings:

  - You are about to drop the `_JournalEntryToTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_JournalEntryToTransaction" DROP CONSTRAINT "_JournalEntryToTransaction_A_fkey";

-- DropForeignKey
ALTER TABLE "_JournalEntryToTransaction" DROP CONSTRAINT "_JournalEntryToTransaction_B_fkey";

-- DropTable
DROP TABLE "_JournalEntryToTransaction";

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
