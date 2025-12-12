import { Role } from "@prisma/enums";
// import { CheckAuth } from "app/middlewares/checkAuth";
// import { validationRequest } from "app/middlewares/validationRequest";
import { Router } from "express";
import paymentController from "./payment.controller";
import { createPaymentValidation } from "./payment.validation";
import { CheckAuth } from "src/app/middlewares/checkAuth";
import { validationRequest } from "src/app/middlewares/validationRequest";
const router = Router();
router.post('/create-intent', CheckAuth(Role.USER, Role.ADMIN), validationRequest(createPaymentValidation), paymentController.createCheckoutSession);
// router.post(
//     '/create-intent',
//     CheckAuth(Role.USER, Role.ADMIN),
//     validationRequest(createPaymentValidation),
//     paymentController.createPaymentIntent
// );
// router.post('/webhook', paymentController.handleWebhook);
// router.get(
//     '/subscription',
//     CheckAuth(Role.USER, Role.ADMIN),
//     paymentController.getMySubscription
// );
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
