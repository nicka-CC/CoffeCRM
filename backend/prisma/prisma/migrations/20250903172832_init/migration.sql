-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "categoryId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Category" (
    "_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
