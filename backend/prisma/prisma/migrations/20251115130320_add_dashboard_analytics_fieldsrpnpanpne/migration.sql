-- AlterTable
ALTER TABLE "public"."StockTransaction" ADD COLUMN     "orderId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."StockTransaction" ADD CONSTRAINT "StockTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
