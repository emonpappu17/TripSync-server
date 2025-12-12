/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


// import envVars from "app/config/env";
// import { stripe } from "app/config/stripe";
// import ApiError from "app/errors/ApiError";
// import { prisma } from "app/lib/prisma";
import { StatusCodes } from "http-status-codes";
import { SubscriptionPlan, SubscriptionStatus } from "../../../../prisma/generated/prisma/enums";
import envVars from "../../config/env";
import { prisma } from "../../lib/prisma";
import ApiError from "../../errors/ApiError";
// import envVars from "src/app/config/env";
// import { stripe } from "src/app/config/stripe";
// import ApiError from "src/app/errors/ApiError";
// import { prisma } from "src/app/lib/prisma";
import {stripe} from "../../../app/config/stripe"

class PaymentService {
    private getStripePriceId(plan: SubscriptionPlan): string {
        const prices = {
            [SubscriptionPlan.MONTHLY]: envVars.STRIPE_PRICE_MONTHLY as string,
            [SubscriptionPlan.YEARLY]: envVars.STRIPE_PRICE_YEARLY as string,
            [SubscriptionPlan.FREE]: "",
        };
        return prices[plan];
    }

    private getPlanDuration(plan: SubscriptionPlan): number {
        const durations = {
            [SubscriptionPlan.MONTHLY]: 30,
            [SubscriptionPlan.YEARLY]: 365,
            [SubscriptionPlan.FREE]: 0,
        };
        return durations[plan];
    }

    async createCheckoutSession(userId: string, paymentData: any) {
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


    // async getMySubscription(userId: string) {
    //     const subscription = await prisma.subscription.findFirst({
    //         where: { userId },
    //         orderBy: { createdAt: 'desc' },
    //         include: {
    //             payment: {
    //                 select: {
    //                     amount: true,
    //                     currency: true,
    //                     paidAt: true,
    //                     transactionId: true,
    //                 },
    //             },
    //         },
    //     });

    //     return subscription;
    // }

    // async cancelSubscription(userId: string, reason?: string) {
    //     const subscription = await prisma.subscription.findFirst({
    //         where: {
    //             userId,
    //             status: SubscriptionStatus.ACTIVE,
    //         },
    //     });

    //     if (!subscription) {
    //         throw new ApiError(httpStatus.NOT_FOUND, 'No active subscription found');
    //     }

    //     await prisma.subscription.update({
    //         where: { id: subscription.id },
    //         data: {
    //             status: SubscriptionStatus.CANCELLED,
    //             cancelledAt: new Date(),
    //             cancelReason: reason,
    //             autoRenew: false,
    //         },
    //     });

    //     // Note: Benefits continue until endDate
    // }

    // async getPaymentHistory(userId: string, query: any) {
    //     const { page = 1, limit = 10 } = query;
    //     const skip = (page - 1) * limit;

    //     const [total, payments] = await Promise.all([
    //         prisma.payment.count({ where: { userId } }),
    //         prisma.payment.findMany({
    //             where: { userId },
    //             skip,
    //             take: limit,
    //             orderBy: { createdAt: 'desc' },
    //             select: {
    //                 id: true,
    //                 amount: true,
    //                 currency: true,
    //                 paymentMethod: true,
    //                 transactionId: true,
    //                 status: true,
    //                 description: true,
    //                 paidAt: true,
    //                 createdAt: true,
    //             },
    //         }),
    //     ]);

    //     return {
    //         data: payments,
    //         meta: {
    //             page,
    //             limit,
    //             total,
    //             totalPages: Math.ceil(total / limit),
    //         },
    //     };
    // }
}

export default new PaymentService();