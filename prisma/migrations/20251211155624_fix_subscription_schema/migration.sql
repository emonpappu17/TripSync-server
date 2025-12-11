/*
  Warnings:

  - You are about to drop the column `paymentId` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `stripeSubscriptionId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_paymentId_fkey";

-- DropIndex
DROP INDEX "subscriptions_paymentId_key";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "subscriptionId" TEXT;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "paymentId",
ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL;
