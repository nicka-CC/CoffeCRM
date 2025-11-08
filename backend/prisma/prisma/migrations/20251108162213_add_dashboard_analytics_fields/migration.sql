/*
  Warnings:

  - The `type` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[confirmationCode]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."BookingType" AS ENUM ('TABLE', 'EVENT', 'MEETING', 'PRIVATE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'CARD', 'ONLINE', 'BONUS', 'FREE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."BookingStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "public"."BookingStatus" ADD VALUE 'NO_SHOW';

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "confirmationCode" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "deposit" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "guestsCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "parentBookingId" TEXT,
ADD COLUMN     "paymentMethod" "public"."PaymentMethod",
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "recurrenceRule" TEXT,
ADD COLUMN     "reminderDate" TIMESTAMP(3),
ADD COLUMN     "reminderSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "specialRequests" TEXT,
ADD COLUMN     "tableNumber" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "title" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."BookingType" NOT NULL DEFAULT 'TABLE';

-- CreateIndex
CREATE UNIQUE INDEX "Booking_confirmationCode_key" ON "public"."Booking"("confirmationCode");

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
