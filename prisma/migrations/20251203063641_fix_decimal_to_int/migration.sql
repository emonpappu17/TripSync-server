/*
  Warnings:

  - You are about to alter the column `budgetMin` on the `travel_plans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `budgetMax` on the `travel_plans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "travel_plans" ALTER COLUMN "budgetMin" SET DATA TYPE INTEGER,
ALTER COLUMN "budgetMax" SET DATA TYPE INTEGER;
