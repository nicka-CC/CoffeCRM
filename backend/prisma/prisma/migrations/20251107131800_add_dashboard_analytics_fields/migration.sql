/*
  Warnings:

  - A unique constraint covering the columns `[branchId,productId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Branch" ADD COLUMN     "email" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_branchId_productId_key" ON "public"."Stock"("branchId", "productId");
