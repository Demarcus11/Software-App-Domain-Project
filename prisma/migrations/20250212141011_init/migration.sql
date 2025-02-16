/*
  Warnings:

  - The values [REGULAR] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `notes` on the `access_requests` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `access_requests` table. All the data in the column will be lost.
  - You are about to drop the column `processedById` on the `access_requests` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `password_history` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `password_history` table. All the data in the column will be lost.
  - You are about to drop the column `questionText` on the `security_questions` table. All the data in the column will be lost.
  - You are about to drop the column `currentPasswordId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `email_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suspension_history` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[question]` on the table `security_questions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[passwordResetToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `httpStatusCode` to the `error_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldPassword` to the `password_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `security_questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('ADMIN', 'MANAGER', 'ACCONTANT');
ALTER TABLE "users" ALTER COLUMN "userType" TYPE "UserType_new" USING ("userType"::text::"UserType_new");
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "UserType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_processedById_fkey";

-- DropForeignKey
ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_userId_fkey";

-- DropForeignKey
ALTER TABLE "email_log" DROP CONSTRAINT "email_log_sentById_fkey";

-- DropForeignKey
ALTER TABLE "email_log" DROP CONSTRAINT "email_log_userId_fkey";

-- DropForeignKey
ALTER TABLE "password_history" DROP CONSTRAINT "password_history_userId_fkey";

-- DropForeignKey
ALTER TABLE "suspension_history" DROP CONSTRAINT "suspension_history_suspendedById_fkey";

-- DropForeignKey
ALTER TABLE "suspension_history" DROP CONSTRAINT "suspension_history_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_security_questions" DROP CONSTRAINT "user_security_questions_questionId_fkey";

-- DropForeignKey
ALTER TABLE "user_security_questions" DROP CONSTRAINT "user_security_questions_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_currentPasswordId_fkey";

-- DropIndex
DROP INDEX "users_currentPasswordId_key";

-- AlterTable
ALTER TABLE "access_requests" DROP COLUMN "notes",
DROP COLUMN "processedAt",
DROP COLUMN "processedById";

-- AlterTable
ALTER TABLE "error_messages" ADD COLUMN     "httpStatusCode" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "password_history" DROP COLUMN "expiresAt",
DROP COLUMN "passwordHash",
ADD COLUMN     "oldPassword" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "security_questions" DROP COLUMN "questionText",
ADD COLUMN     "question" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "currentPasswordId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "lastPasswordChangeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "passwordResetTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "suspensionEnd" TIMESTAMP(3),
ADD COLUMN     "suspensionStart" TIMESTAMP(3);

-- DropTable
DROP TABLE "email_log";

-- DropTable
DROP TABLE "suspension_history";

-- CreateIndex
CREATE UNIQUE INDEX "security_questions_question_key" ON "security_questions"("question");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_passwordResetToken_key" ON "users"("passwordResetToken");

-- AddForeignKey
ALTER TABLE "password_history" ADD CONSTRAINT "password_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_security_questions" ADD CONSTRAINT "user_security_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_security_questions" ADD CONSTRAINT "user_security_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "security_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
