import { Role } from "@prisma/enums";
import { CheckAuth } from "app/middlewares/checkAuth";
import { validationRequest } from "app/middlewares/validationRequest";
import { Router } from "express";
import { createTravelPlanValidation } from "./travelPlan.validation";
import travelPlanController from "./travelPlan.controller";

const router = Router();

// Public routes
router.get(
    '/',
    travelPlanController.getTravelPlans
);

router.get('/:id', travelPlanController.getTravelPlanById);

// Protected routes
router.post(
    '/',
    CheckAuth(Role.USER, Role.ADMIN),
    validationRequest(createTravelPlanValidation),
    travelPlanController.createTravelPlan
);

router.get(
    '/my/plans',
    CheckAuth(Role.USER, Role.ADMIN),
    travelPlanController.getMyTravelPlans
);

// router.patch(
//     '/:id',
//     CheckAuth(Role.USER, Role.ADMIN),
//     validateRequest(updateTravelPlanValidation),
//     travelPlanController.updateTravelPlan
// );

// router.delete(
//     '/:id',
//     CheckAuth(Role.USER, Role.ADMIN),
//     travelPlanController.deleteTravelPlan
// );


export const travelPlanRoutes = router;


