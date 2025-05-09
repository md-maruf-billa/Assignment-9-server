/*
  Warnings:

  - You are about to drop the column `images` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `moderationNote` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseSource` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "images",
DROP COLUMN "moderationNote",
DROP COLUMN "purchaseSource",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "ReviewStatus";
