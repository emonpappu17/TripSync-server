import { Router } from "express";
import adminController from "./admin.controller";
import { userActionValidation } from "./admin.validation";
import { CheckAuth } from "../../middlewares/checkAuth";
import { validationRequest } from "../../middlewares/validationRequest";
import { Role } from "@prisma/client";


const router = Router();

// All routes require admin role
router.use(CheckAuth(Role.ADMIN));

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

router.get(
    '/analytics',
    adminController.getAnalytics
);

// // User Management
router.get(
    '/users',
    adminController.getAllUsers
);
router.post(
    '/users/action',
    validationRequest(userActionValidation),
    adminController.manageUser
);

// // Content Moderation
router.get('/travel-plans', adminController.getAllTravelPlans);

// router.post('/moderate', validationRequest(contentModerationValidation), adminController.moderateContent);

// // Activity Logs
// router.get('/activity-logs', adminController.getActivityLogs);

export const adminRoutes = router;