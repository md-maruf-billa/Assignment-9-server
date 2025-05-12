-- CreateTable
CREATE TABLE "review_email_votes" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_email_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_email_votes_reviewId_email_key" ON "review_email_votes"("reviewId", "email");

-- AddForeignKey
ALTER TABLE "review_email_votes" ADD CONSTRAINT "review_email_votes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
