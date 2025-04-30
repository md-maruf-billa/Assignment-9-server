/*
  Warnings:

  - The `isActive` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActive",
ADD COLUMN     "isActive" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "activeStatus";
