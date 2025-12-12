"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
// import { Role } from "prisma/generated/prisma/enums";
// import { CheckAuth } from "app/middlewares/checkAuth";
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("./admin.controller"));
// import { validationRequest } from "app/middlewares/validationRequest";
const admin_validation_1 = require("./admin.validation");
// import { Role } from "../../../../prisma/generated/prisma/enums";
const checkAuth_1 = require("../../middlewares/checkAuth");
const validationRequest_1 = require("../../middlewares/validationRequest");
const client_1 = require("@prisma/client");
// import { CheckAuth } from "src/app/middlewares/checkAuth";
// import { validationRequest } from "src/app/middlewares/validationRequest";
const router = (0, express_1.Router)();
// All routes require admin role
router.use((0, checkAuth_1.CheckAuth)(client_1.Role.ADMIN));
// Dashboard
router.get('/dashboard/stats', admin_controller_1.default.getDashboardStats);
router.get('/analytics', admin_controller_1.default.getAnalytics);
// // User Management
router.get('/users', admin_controller_1.default.getAllUsers);
router.post('/users/action', (0, validationRequest_1.validationRequest)(admin_validation_1.userActionValidation), admin_controller_1.default.manageUser);
// // Content Moderation
router.get('/travel-plans', admin_controller_1.default.getAllTravelPlans);
// router.post('/moderate', validationRequest(contentModerationValidation), adminController.moderateContent);
// // Activity Logs
// router.get('/activity-logs', adminController.getActivityLogs);
exports.adminRoutes = router;
