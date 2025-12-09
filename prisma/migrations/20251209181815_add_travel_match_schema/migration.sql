-- CreateTable
CREATE TABLE "travel_matches" (
    "id" TEXT NOT NULL,
    "travelPlanId" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "travel_matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "travel_matches_travelPlanId_user1Id_user2Id_key" ON "travel_matches"("travelPlanId", "user1Id", "user2Id");

-- AddForeignKey
ALTER TABLE "travel_matches" ADD CONSTRAINT "travel_matches_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "travel_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
