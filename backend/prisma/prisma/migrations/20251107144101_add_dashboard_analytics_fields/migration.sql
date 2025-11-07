/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Branch" ADD COLUMN     "area" DOUBLE PRECISION,
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "closeTime" TEXT,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'Россия',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "managerPhone" TEXT,
ADD COLUMN     "openTime" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Europe/Moscow',
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "allergens" TEXT,
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "carbs" DOUBLE PRECISION,
ADD COLUMN     "composition" TEXT,
ADD COLUMN     "fats" DOUBLE PRECISION,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "oldPrice" DOUBLE PRECISION,
ADD COLUMN     "proteins" DOUBLE PRECISION,
ADD COLUMN     "shelfLife" INTEGER,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "storageTemp" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'шт',
ADD COLUMN     "volume" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Stock" ADD COLUMN     "batchNumber" TEXT,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "lastRestockedAt" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "maxQuantity" INTEGER,
ADD COLUMN     "minQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "purchasePrice" DOUBLE PRECISION,
ADD COLUMN     "reorderPoint" INTEGER,
ADD COLUMN     "reserved" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "supplier" TEXT;

-- AlterTable
ALTER TABLE "public"."StockTransaction" ADD COLUMN     "batchNumber" TEXT,
ADD COLUMN     "document" TEXT,
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "supplier" TEXT,
ADD COLUMN     "totalPrice" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "public"."Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "public"."Product"("barcode");
