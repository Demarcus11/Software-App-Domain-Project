-- CreateEnum
CREATE TYPE "AccountCategory" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "AccountSubcategory" AS ENUM ('CURRENT_ASSETS', 'FIXED_ASSETS', 'CURRENT_LIABILITIES', 'LONG_TERM_LIABILITIES', 'RETAINED_EARNINGS', 'OPERATING_REVENUE', 'OPERATING_EXPENSE');

-- CreateEnum
CREATE TYPE "StatementType" AS ENUM ('IS', 'BS', 'RE');

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountDescription" TEXT NOT NULL,
    "normalSide" TEXT NOT NULL,
    "category" "AccountCategory" NOT NULL,
    "subcategory" "AccountSubcategory" NOT NULL,
    "initialBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "debit" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "credit" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "statement" "StatementType" NOT NULL,
    "comment" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_logs" (
    "id" SERIAL NOT NULL,
    "eventType" TEXT NOT NULL,
    "beforeImage" JSONB,
    "afterImage" JSONB,
    "userId" INTEGER NOT NULL,
    "accountId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_accountName_key" ON "accounts"("accountName");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_accountNumber_key" ON "accounts"("accountNumber");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
