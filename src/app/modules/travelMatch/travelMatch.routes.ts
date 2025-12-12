// import { Role } from "prisma/generated/prisma/client";
// import { CheckAuth } from "app/middlewares/checkAuth";
import { Router } from "express";
import travelMatchController from "./travelMatch.controller";
import { CheckAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";
// import { CheckAuth } from "src/app/middlewares/checkAuth";

const router = Router();

// All routes require authentication
router.use(CheckAuth(Role.USER, Role.ADMIN));

// Get authenticated user's matches
router.get(
    '/my-matches',
    travelMatchController.getMyMatches
);

// Get match statistics
router.get(
    '/statistics',
    travelMatchController.getMatchStatistics
);

// Get matches for a specific travel plan
router.get(
    '/plan/:planId',
    travelMatchController.getMatchesByPlanId
);

// Check if matched with another user for a plan
router.get(
    '/check/:planId/:otherUserId',
    travelMatchController.checkMatch
);

// Get specific match details
router.get(
    '/:matchId',
    travelMatchController.getMatchById
);

// Deactivate a match
router.delete(
    '/:matchId',
    travelMatchController.deactivateMatch
);

export const travelMatchRoutes = router;