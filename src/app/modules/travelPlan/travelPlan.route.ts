import { Router } from "express";
import travelPlanController from "./travelPlan.controller";
import { createTravelPlanValidation, updateTravelPlanValidation } from "./travelPlan.validation";
import { CheckAuth } from "../../middlewares/checkAuth";

import { fileUploader } from "../../helper/fileUploader";
import { validationRequest } from "../../middlewares/validationRequest";
import { Role } from "@prisma/client";


const router = Router();

// Public routes
router.get(
    '/',
    travelPlanController.getTravelPlans
);

router.get('/:id', travelPlanController.getTravelPlanById);
router.get('/user/:id', travelPlanController.getTravelPlanByUserId);

// Protected routes
router.post(
    '/',
    CheckAuth(Role.USER, Role.ADMIN),
    fileUploader.upload.single("file"),
    validationRequest(createTravelPlanValidation),
    travelPlanController.createTravelPlan
);

router.get(
    '/my/plans',
    CheckAuth(Role.USER, Role.ADMIN),
    travelPlanController.getMyTravelPlans
);

router.patch(
    '/:id',
    CheckAuth(Role.USER, Role.ADMIN),
    fileUploader.upload.single("file"),
    validationRequest(updateTravelPlanValidation),
    travelPlanController.updateTravelPlan
);

router.delete(
    '/:id',
    CheckAuth(Role.USER, Role.ADMIN),
    travelPlanController.deleteTravelPlan
);


export const travelPlanRoutes = router;


