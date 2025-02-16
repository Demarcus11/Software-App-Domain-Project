/*
  Warnings:

  - You are about to drop the column `userType` on the `users` table. All the data in the column will be lost.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'MANAGER', 'USER');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "userType",
ADD COLUMN     "role" "Roles" NOT NULL;

-- DropEnum
DROP TYPE "UserType";
