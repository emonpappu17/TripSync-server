"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelMatchRoutes = void 0;
// import { Role } from "prisma/generated/prisma/client";
// import { CheckAuth } from "app/middlewares/checkAuth";
const express_1 = require("express");
const travelMatch_controller_1 = __importDefault(require("./travelMatch.controller"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
// import { CheckAuth } from "src/app/middlewares/checkAuth";
const router = (0, express_1.Router)();
// All routes require authentication
router.use((0, checkAuth_1.CheckAuth)(client_1.Role.USER, client_1.Role.ADMIN));
// Get authenticated user's matches
router.get('/my-matches', travelMatch_controller_1.default.getMyMatches);
// Get match statistics
router.get('/statistics', travelMatch_controller_1.default.getMatchStatistics);
// Get matches for a specific travel plan
router.get('/plan/:planId', travelMatch_controller_1.default.getMatchesByPlanId);
// Check if matched with another user for a plan
router.get('/check/:planId/:otherUserId', travelMatch_controller_1.default.checkMatch);
// Get specific match details
router.get('/:matchId', travelMatch_controller_1.default.getMatchById);
// Deactivate a match
router.delete('/:matchId', travelMatch_controller_1.default.deactivateMatch);
exports.travelMatchRoutes = router;
