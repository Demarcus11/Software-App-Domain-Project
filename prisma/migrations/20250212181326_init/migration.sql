/*
  Warnings:

  - You are about to drop the column `isExpired` on the `password_history` table. All the data in the column will be lost.
  - Added the required column `passwordExpiresAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "password_history" DROP COLUMN "isExpired";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "passwordExpiresAt" TIMESTAMP(3) NOT NULL;
