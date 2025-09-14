/*
  Warnings:

  - You are about to drop the column `cartId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_cartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_orderId_fkey";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "cartId",
DROP COLUMN "orderId";

-- CreateTable
CREATE TABLE "public"."CartandAndOrdersOnProduct" (
    "_id" SERIAL NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT NOT NULL,
    "cartId" INTEGER,
    "orderId" INTEGER,
    "productId" INTEGER,

    CONSTRAINT "CartandAndOrdersOnProduct_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "public"."CartandAndOrdersOnProduct" ADD CONSTRAINT "CartandAndOrdersOnProduct_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartandAndOrdersOnProduct" ADD CONSTRAINT "CartandAndOrdersOnProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartandAndOrdersOnProduct" ADD CONSTRAINT "CartandAndOrdersOnProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
