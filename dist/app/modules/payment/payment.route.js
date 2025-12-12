"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
// import { Role } from "prisma/generated/prisma/enums";
// import { CheckAuth } from "app/middlewares/checkAuth";
// import { validationRequest } from "app/middlewares/validationRequest";
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("./payment.controller"));
const payment_validation_1 = require("./payment.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
// import { Role } from "../../../../prisma/generated/prisma/enums";
const validationRequest_1 = require("../../middlewares/validationRequest");
const client_1 = require("@prisma/client");
// import { CheckAuth } from "src/app/middlewares/checkAuth";
// import { validationRequest } from "src/app/middlewares/validationRequest";
const router = (0, express_1.Router)();
router.post('/create-intent', (0, checkAuth_1.CheckAuth)(client_1.Role.USER, client_1.Role.ADMIN), (0, validationRequest_1.validationRequest)(payment_validation_1.createPaymentValidation), payment_controller_1.default.createCheckoutSession);
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
