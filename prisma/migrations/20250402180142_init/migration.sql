-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_journalEntryId_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "journalEntryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
