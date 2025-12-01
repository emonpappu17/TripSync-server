-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tourPlanId_fkey" FOREIGN KEY ("tourPlanId") REFERENCES "travel_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
