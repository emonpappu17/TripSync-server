"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const catchAsync_1 = __importDefault(require("app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("app/utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const payment_service_1 = __importDefault(require("./payment.service"));
const stripe_1 = require("app/config/stripe");
const env_1 = __importDefault(require("app/config/env"));
// import catchAsync from "app/utils/catchAsync";
// import catchAsync from "src/app/utils/catchAsync";
// import sendResponse from "src/app/utils/sendResponse";
// import { stripe } from "src/app/config/stripe";
// import envVars from "src/app/config/env";
// import { prisma } from "src/app/lib/prisma";
const prisma_1 = require("app/lib/prisma");
class PaymentController {
    createCheckoutSession = (0, catchAsync_1.default)(async (req, res) => {
        const userId = req.user.id;
        const result = await payment_service_1.default.createCheckoutSession(userId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'createCheckoutSession created successfully',
            data: result,
        });
    });
    stripeWebhook = (0, catchAsync_1.default)(async (req, res) => {
        let event;
        try {
            event = await stripe_1.stripe.webhooks.constructEventAsync(req.body, req.headers["stripe-signature"], env_1.default.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            console.log(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        if (event?.type === "checkout.session.completed") {
            const session = event.data.object;
            const userId = session.metadata.userId;
            const plan = session.metadata.plan;
            const durationDays = plan === "MONTHLY" ? 30 : 365;
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + durationDays);
            await prisma_1.prisma.$transaction([
                prisma_1.prisma.subscription.create({
                    data: {
                        userId,
                        plan,
                        status: "ACTIVE",
                        startDate,
                        endDate,
                        stripeSubscriptionId: session.subscription,
                    },
                }),
                prisma_1.prisma.user.update({
                    where: { id: userId },
                    data: { isVerified: true },
                }),
            ]);
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'Webhook request send successfully!',
        });
    });
}
exports.default = new PaymentController();
