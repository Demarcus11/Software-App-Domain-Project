/*
  Warnings:

  - You are about to drop the column `order` on the `accounts` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "order",
ADD COLUMN     "orderId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_name_key" ON "orders"("name");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
