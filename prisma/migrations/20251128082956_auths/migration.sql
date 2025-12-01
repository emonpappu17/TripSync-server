/*
  Warnings:

  - You are about to drop the column `authProvider` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider]` on the table `auth_providers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerId` to the `auth_providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auth_providers" ADD COLUMN     "providerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "authProvider";

-- CreateIndex
CREATE UNIQUE INDEX "auth_providers_provider_key" ON "auth_providers"("provider");
