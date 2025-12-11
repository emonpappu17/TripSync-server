/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentStatus, SubscriptionPlan, SubscriptionStatus } from "@prisma/enums";
import envVars from "app/config/env";
import { stripe } from "app/config/stripe";
import ApiError from "app/errors/ApiError";
import { prisma } from "app/lib/prisma";
import { StatusCodes } from "http-status-codes";

class PaymentService {
    // private getPlanPrice(plan: SubscriptionPlan): number {
    //     const prices = {
    //         [SubscriptionPlan.MONTHLY]: 29.99,
    //         [SubscriptionPlan.YEARLY]: 299.99,
    //         [SubscriptionPlan.FREE]: 0,
    //     };
    //     return prices[plan];
    // }

    // private getPlanDuration(plan: SubscriptionPlan): number {
    //     const durations = {
    //         [SubscriptionPlan.MONTHLY]: 30,
    //         [SubscriptionPlan.YEARLY]: 365,
    //         [SubscriptionPlan.FREE]: 0,
    //     };
    //     return durations[plan];
    // }

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

            // success_url: `https://www.facebook.com`,
            // cancel_url: `https://github.com`,
        });

        return { paymentUrl: session.url };
    }

// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: "2023-10-16" });



    // async createPaymentIntent(userId: string, paymentData: any) {
    //     const { plan, paymentMethod } = paymentData;

    //     // Check if user already has active subscription
    //     const activeSubscription = await prisma.subscription.findFirst({
    //         where: {
    //             userId,
    //             status: SubscriptionStatus.ACTIVE,
    //             endDate: { gte: new Date() },
    //         },
    //     });

    //     if (activeSubscription) {
    //         throw new ApiError(
    //             StatusCodes.BAD_REQUEST,
    //             'You already have an active subscription'
    //         );
    //     }

    //     const amount = this.getPlanPrice(plan);

    //     if (amount === 0) {
    //         throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot process payment for free plan');
    //     }



    //     const session = await stripe.checkout.sessions.create({
    //         payment_method_types: ["card"],
    //         mode: "subscription",
    //         customer_email: user.email,

    //         line_items: [
    //             {
    //                 price_data: {
    //                     currency: "bdt",
    //                     product_data: {
    //                         name: `Appointment with ${doctorData.name}`,
    //                         // description: `Appointment with Doctor ID: ${doctorId}`,
    //                     },
    //                     unit_amount: doctorData.appointmentFee * 100, // cents
    //                 },
    //                 quantity: 1,
    //             },
    //         ],
    //         // metadata: {
    //         //     appointmentId: appointmentData.id,
    //         //     paymentId: paymentData.id
    //         // },

    //         metadata: {
    //             userId,
    //             plan,
    //         },
    //         success_url: `https://www.facebook.com`,
    //         cancel_url: `https://github.com`,
    //     });

    //     // console.log({ session });

    //     return { paymentUrl: session.url }

    // }

    // async handlePaymentWebhook(webhookData: any) {
    //     const { transactionId, status, amount, metadata } = webhookData;

    //     // Find payment
    //     const payment = await prisma.payment.findUnique({
    //         where: { transactionId },
    //     });

    //     if (!payment) {
    //         throw new ApiError(StatusCodes.NOT_FOUND, 'Payment not found');
    //     }

    //     if (payment.status !== PaymentStatus.PENDING) {
    //         return; // Already processed
    //     }

    //     // Update payment in transaction
    //     await prisma.$transaction(async (tx) => {
    //         // Update payment status
    //         await tx.payment.update({
    //             where: { id: payment.id },
    //             data: {
    //                 status,
    //                 // paidAt: status === PaymentStatus.COMPLETED ? new Date() : null,
    //             },
    //         });

    //         // If payment successful, create subscription
    //         if (status === PaymentStatus.COMPLETED) {
    //             const plan = "MONTHLY";
    //             // const plan = payment.metadata.plan as SubscriptionPlan;
    //             const duration = this.getPlanDuration(plan);
    //             const endDate = new Date();
    //             endDate.setDate(endDate.getDate() + duration);

    //             await tx.subscription.create({
    //                 data: {
    //                     userId: payment.userId,
    //                     paymentId: payment.id,
    //                     plan,
    //                     status: SubscriptionStatus.ACTIVE,
    //                     startDate: new Date(),
    //                     endDate,
    //                 },
    //             });

    //             // Update profile verification
    //             await tx.user.update({
    //                 where: { id: payment.userId },
    //                 data: { isVerified: true },
    //             });
    //             // await tx.profile.update({
    //             //     where: { userId: payment.userId },
    //             //     data: { isVerified: true },
    //             // });

    //             // Create notification
    //             // await tx.notification.create({
    //             //     data: {
    //             //         userId: payment.userId,
    //             //         title: 'Subscription Activated',
    //             //         message: `Your ${plan.toLowerCase()} subscription has been activated successfully!`,
    //             //         type: 'payment',
    //             //     },
    //             // });
    //         }
    //     });
    // }

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