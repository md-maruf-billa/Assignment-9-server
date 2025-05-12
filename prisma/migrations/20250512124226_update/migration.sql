-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'FAILED';

-- DropIndex
DROP INDEX "payments_accountId_key";

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "accountId" TEXT;

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "accountEmail" TEXT NOT NULL,
    "type" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "votes_reviewId_accountEmail_key" ON "votes"("reviewId", "accountEmail");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_accountEmail_fkey" FOREIGN KEY ("accountEmail") REFERENCES "accounts"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
