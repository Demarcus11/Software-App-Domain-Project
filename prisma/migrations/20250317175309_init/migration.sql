/*
  Warnings:

  - You are about to drop the column `accountId` on the `event_logs` table. All the data in the column will be lost.
  - You are about to drop the column `afterImage` on the `event_logs` table. All the data in the column will be lost.
  - You are about to drop the column `beforeImage` on the `event_logs` table. All the data in the column will be lost.
  - Added the required column `recordId` to the `event_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tableName` to the `event_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event_logs" DROP CONSTRAINT "event_logs_accountId_fkey";

-- DropForeignKey
ALTER TABLE "event_logs" DROP CONSTRAINT "event_logs_userId_fkey";

-- AlterTable
ALTER TABLE "event_logs" DROP COLUMN "accountId",
DROP COLUMN "afterImage",
DROP COLUMN "beforeImage",
ADD COLUMN     "afterState" JSONB,
ADD COLUMN     "beforeState" JSONB,
ADD COLUMN     "recordId" INTEGER NOT NULL,
ADD COLUMN     "tableName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
