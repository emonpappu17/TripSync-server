/*
  Warnings:

  - You are about to drop the `travel_interests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_travel_interests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_travel_interests" DROP CONSTRAINT "user_travel_interests_travelInterestId_fkey";

-- DropForeignKey
ALTER TABLE "user_travel_interests" DROP CONSTRAINT "user_travel_interests_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "visitedCountries" SET DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "travel_interests";

-- DropTable
DROP TABLE "user_travel_interests";
