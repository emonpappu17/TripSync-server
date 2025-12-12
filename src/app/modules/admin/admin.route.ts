// import { Role } from "prisma/generated/prisma/enums";
// import { CheckAuth } from "app/middlewares/checkAuth";
import { Router } from "express";
import adminController from "./admin.controller";
// import { validationRequest } from "app/middlewares/validationRequest";
import { userActionValidation } from "./admin.validation";
// import { Role } from "../../../../prisma/generated/prisma/enums";
import { CheckAuth } from "../../middlewares/checkAuth";
import { validationRequest } from "../../middlewares/validationRequest";
import { Role } from "@prisma/client";
// import { CheckAuth } from "src/app/middlewares/checkAuth";
// import { validationRequest } from "src/app/middlewares/validationRequest";

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