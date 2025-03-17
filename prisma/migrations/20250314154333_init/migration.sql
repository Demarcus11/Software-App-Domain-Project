/*
  Warnings:

  - You are about to drop the column `category` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `statement` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory` on the `accounts` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statementId` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subcategoryId` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "category",
DROP COLUMN "statement",
DROP COLUMN "subcategory",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "statementId" INTEGER NOT NULL,
ADD COLUMN     "subcategoryId" INTEGER NOT NULL,
ALTER COLUMN "order" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statements" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "statements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subcategories_name_key" ON "subcategories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "statements_name_key" ON "statements"("name");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "statements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
