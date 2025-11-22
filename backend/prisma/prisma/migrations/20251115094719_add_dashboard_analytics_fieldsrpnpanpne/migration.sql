-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "type" "public"."TransactionType" NOT NULL DEFAULT 'EXPENSE';
