"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const enums_1 = require("@prisma/enums");
const checkAuth_1 = require("app/middlewares/checkAuth");
const validationRequest_1 = require("app/middlewares/validationRequest");
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("./payment.controller"));
const payment_validation_1 = require("./payment.validation");
// import { CheckAuth } from "src/app/middlewares/checkAuth";
// import { validationRequest } from "src/app/middlewares/validationRequest";
const router = (0, express_1.Router)();
router.post('/create-intent', (0, checkAuth_1.CheckAuth)(enums_1.Role.USER, enums_1.Role.ADMIN), (0, validationRequest_1.validationRequest)(payment_validation_1.createPaymentValidation), payment_controller_1.default.createCheckoutSession);
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
exports.paymentRoutes = router;
