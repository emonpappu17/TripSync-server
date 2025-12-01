/*
  Warnings:

  - You are about to drop the column `providerId` on the `auth_providers` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "auth_providers_providerId_key";

-- AlterTable
ALTER TABLE "auth_providers" DROP COLUMN "providerId";
