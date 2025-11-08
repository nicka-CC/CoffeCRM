/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Integration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "accountant" TEXT,
ADD COLUMN     "actualAddress" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "bankBik" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'RUB',
ADD COLUMN     "director" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "inn" TEXT,
ADD COLUMN     "kpp" TEXT,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'ru',
ADD COLUMN     "legalName" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "ogrn" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "settings" TEXT,
ADD COLUMN     "taxSystem" TEXT,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Europe/Moscow',
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "averageCheck" DOUBLE PRECISION,
ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "discountPercent" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "favoriteBranch" TEXT,
ADD COLUMN     "favoriteProduct" TEXT,
ADD COLUMN     "lastOrderDate" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "preferences" TEXT,
ADD COLUMN     "referralCode" TEXT,
ADD COLUMN     "referredBy" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "totalOrders" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "vipStatus" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Integration" ADD COLUMN     "apiSecret" TEXT,
ADD COLUMN     "apiUrl" TEXT,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isTest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSyncAt" TIMESTAMP(3),
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "settings" TEXT,
ADD COLUMN     "syncStatus" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "webhookUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."PaymentSettings" ADD COLUMN     "commission" DOUBLE PRECISION,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isTest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxAmount" DOUBLE PRECISION,
ADD COLUMN     "merchantId" TEXT,
ADD COLUMN     "minAmount" DOUBLE PRECISION,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "secretKey" TEXT,
ADD COLUMN     "settings" TEXT,
ADD COLUMN     "terminalId" TEXT,
ADD COLUMN     "webhookUrl" TEXT;

-- CreateTable
CREATE TABLE "public"."BonusTransaction" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "orderId" TEXT,
    "description" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BonusTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_referralCode_key" ON "public"."Customer"("referralCode");

-- AddForeignKey
ALTER TABLE "public"."BonusTransaction" ADD CONSTRAINT "BonusTransaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
