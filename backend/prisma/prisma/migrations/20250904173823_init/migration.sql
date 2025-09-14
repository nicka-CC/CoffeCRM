/*
  Warnings:

  - You are about to drop the column `productSizeId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_productSizeId_fkey";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "productSizeId";

-- CreateTable
CREATE TABLE "public"."SizesProduct" (
    "_id" SERIAL NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT NOT NULL,
    "productSizeId" INTEGER,
    "productId" INTEGER,

    CONSTRAINT "SizesProduct_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "public"."SizesProduct" ADD CONSTRAINT "SizesProduct_productSizeId_fkey" FOREIGN KEY ("productSizeId") REFERENCES "public"."ProductSize"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SizesProduct" ADD CONSTRAINT "SizesProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
