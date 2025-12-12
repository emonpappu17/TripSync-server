"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import envVars from "app/config/env";
// import { stripe } from "app/config/stripe";
// import ApiError from "app/errors/ApiError";
// import { prisma } from "app/lib/prisma";
const http_status_codes_1 = require("http-status-codes");
// import { SubscriptionPlan, SubscriptionStatus } from "../../../../prisma/generated/prisma/enums";
const env_1 = __importDefault(require("../../config/env"));
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
// import envVars from "src/app/config/env";
// import { stripe } from "src/app/config/stripe";
// import ApiError from "src/app/errors/ApiError";
// import { prisma } from "src/app/lib/prisma";
const stripe_1 = require("../../../app/config/stripe");
const client_1 = require("@prisma/client");
class PaymentService {
    getStripePriceId(plan) {
        const prices = {
            [client_1.SubscriptionPlan.MONTHLY]: env_1.default.STRIPE_PRICE_MONTHLY,
            [client_1.SubscriptionPlan.YEARLY]: env_1.default.STRIPE_PRICE_YEARLY,
            [client_1.SubscriptionPlan.FREE]: "",
        };
        return prices[plan];
    }
    getPlanDuration(plan) {
        const durations = {
            [client_1.SubscriptionPlan.MONTHLY]: 30,
            [client_1.SubscriptionPlan.YEARLY]: 365,
            [client_1.SubscriptionPlan.FREE]: 0,
        };
        return durations[plan];
    }
    async createCheckoutSession(userId, paymentData) {
        const { plan } = paymentData;
        // 1) Validate active subscription
        const activeSubscription = await prisma_1.prisma.subscription.findFirst({
            where: {
                userId,
                status: client_1.SubscriptionStatus.ACTIVE,
                endDate: { gte: new Date() },
            },
        });
        if (activeSubscription) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You already have an active subscription");
        }
        // 2) Get Stripe Price ID
        const stripePriceId = this.getStripePriceId(plan);
        if (!stripePriceId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid plan selected");
        }
        // 3) Get user email
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.email) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User email missing");
        }
        // 4) Create Stripe Checkout Session
        const session = await stripe_1.stripe.checkout.sessions.create({
            mode: "subscription",
            customer_email: user.email,
            line_items: [
                {
                    price: stripePriceId, // VERY IMPORTANT — use price ID
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
                plan,
            },
            success_url: `${env_1.default.FRONTEND_URL}/subscription/success`,
            cancel_url: `${env_1.default.FRONTEND_URL}/subscription/cancel`,
        });
        return { paymentUrl: session.url };
    }
}
exports.default = new PaymentService();
