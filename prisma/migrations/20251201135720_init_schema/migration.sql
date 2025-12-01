-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "TravelType" AS ENUM ('SOLO', 'FAMILY', 'COUPLE', 'FRIENDS');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('PLANNING', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "travel_interests" (
    "id" TEXT NOT NULL,
    "interest" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "travel_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_travel_interests" (
    "travelInterestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_travel_interests_pkey" PRIMARY KEY ("travelInterestId","userId")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "transactionId" TEXT NOT NULL,
    "paymentGatewayData" JSONB,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "destination" TEXT NOT NULL,
    "country" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "budgetMin" DECIMAL(10,2),
    "budgetMax" DECIMAL(10,2),
    "travelType" "TravelType" NOT NULL DEFAULT 'SOLO',
    "maxTravelers" INTEGER,
    "status" "TripStatus" NOT NULL DEFAULT 'PLANNING',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_requests" (
    "id" TEXT NOT NULL,
    "travelPlanId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "message" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "fullName" TEXT NOT NULL,
    "profileImage" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "currentLocation" TEXT,
    "gender" "Gender",
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "visitedCountries" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "fromReviewerId" TEXT NOT NULL,
    "toReviewerId" TEXT NOT NULL,
    "tourPlanId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE INDEX "payments_userId_idx" ON "payments"("userId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_transactionId_idx" ON "payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_paymentId_key" ON "subscriptions"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "travel_requests_travelPlanId_requesterId_key" ON "travel_requests"("travelPlanId", "requesterId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_fullName_idx" ON "users"("fullName");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_fromReviewerId_toReviewerId_key" ON "reviews"("fromReviewerId", "toReviewerId");

-- AddForeignKey
ALTER TABLE "user_travel_interests" ADD CONSTRAINT "user_travel_interests_travelInterestId_fkey" FOREIGN KEY ("travelInterestId") REFERENCES "travel_interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_travel_interests" ADD CONSTRAINT "user_travel_interests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_plans" ADD CONSTRAINT "travel_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_requests" ADD CONSTRAINT "travel_requests_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "travel_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_requests" ADD CONSTRAINT "travel_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_requests" ADD CONSTRAINT "travel_requests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fromReviewerId_fkey" FOREIGN KEY ("fromReviewerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_toReviewerId_fkey" FOREIGN KEY ("toReviewerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
