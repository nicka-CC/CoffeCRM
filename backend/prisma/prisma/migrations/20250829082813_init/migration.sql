/*
  Warnings:

  - You are about to drop the column `comments` on the `Shops` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Shops" DROP COLUMN "comments";

-- AlterTable
ALTER TABLE "public"."comments" ADD COLUMN     "shopsId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_shopsId_fkey" FOREIGN KEY ("shopsId") REFERENCES "public"."Shops"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
