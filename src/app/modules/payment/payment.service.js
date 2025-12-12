/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubscriptionPlan, SubscriptionStatus } from "@prisma/enums";
import envVars from "app/config/env";
import { stripe } from "app/config/stripe";
import ApiError from "app/errors/ApiError";
import { prisma } from "app/lib/prisma";
import { StatusCodes } from "http-status-codes";
class PaymentService {
    getStripePriceId(plan) {
        const prices = {
            [SubscriptionPlan.MONTHLY]: envVars.STRIPE_PRICE_MONTHLY,
            [SubscriptionPlan.YEARLY]: envVars.STRIPE_PRICE_YEARLY,
            [SubscriptionPlan.FREE]: "",
        };
        return prices[plan];
    }
    getPlanDuration(plan) {
        const durations = {
            [SubscriptionPlan.MONTHLY]: 30,
            [SubscriptionPlan.YEARLY]: 365,
            [SubscriptionPlan.FREE]: 0,
        };
        return durations[plan];
    }
    async createCheckoutSession(userId, paymentData) {
        const { plan } = paymentData;
        // 1) Validate active subscription
        const activeSubscription = await prisma.subscription.findFirst({
            where: {
                userId,
                status: SubscriptionStatus.ACTIVE,
                endDate: { gte: new Date() },
            },
        });
        if (activeSubscription) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "You already have an active subscription");
        }
        // 2) Get Stripe Price ID
        const stripePriceId = this.getStripePriceId(plan);
        if (!stripePriceId) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid plan selected");
        }
        // 3) Get user email
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.email) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "User email missing");
        }
        // 4) Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
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
            success_url: `${envVars.FRONTEND_URL}/subscription/success`,
            cancel_url: `${envVars.FRONTEND_URL}/subscription/cancel`,
        });
        return { paymentUrl: session.url };
    }
}
export default new PaymentService();
