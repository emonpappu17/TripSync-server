import { Router } from "express";
import paymentController from "./payment.controller";
import { createPaymentValidation } from "./payment.validation";
import { CheckAuth } from "../../middlewares/checkAuth";
import { validationRequest } from "../../middlewares/validationRequest";
import { Role } from "@prisma/client";

const router = Router();

router.post(
    '/create-intent',
    CheckAuth(Role.USER, Role.ADMIN),
    validationRequest(createPaymentValidation),
    paymentController.createCheckoutSession
);


// router.post('/webhook', paymentController.handleWebhook);

router.get(
    '/subscription',
    CheckAuth(Role.USER, Role.ADMIN),
    paymentController.getMySubscription
);

// router.post(
//     '/subscription/cancel',
//     CheckAuth(Role.USER, Role.ADMIN),
//     paymentController.cancelSubscription
// );

// router.get(
//     '/history',
//     CheckAuth(Role.USER, Role.ADMIN),
//     paymentController.getPaymentHistory
// );

export const paymentRoutes = router;