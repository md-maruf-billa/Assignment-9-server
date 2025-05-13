/*
  Warnings:

  - You are about to drop the column `accountId` on the `reviews` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_accountId_fkey";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "accountId",
ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING';
