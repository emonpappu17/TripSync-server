/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import paymentService from "./payment.service";
import { stripe } from "app/config/stripe";
import envVars from "app/config/env";
import Stripe from "stripe";
import { prisma } from "app/lib/prisma";

class PaymentController {
    createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const result = await paymentService.createCheckoutSession(userId, req.body);

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'createCheckoutSession created successfully',
            data: result,
        });
    });


    stripeWebhook = catchAsync(async (req: Request, res: Response) => {
        let event: Stripe.Event;
        try {
            event = await stripe.webhooks.constructEventAsync(
                req.body,
                req.headers["stripe-signature"] as string,
                envVars.STRIPE_WEBHOOK_SECRET as string
            );
        } catch (err: any) {
            console.log(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }


        if (event?.type === "checkout.session.completed") {
            const session = event.data.object as any;

            const userId = session.metadata.userId;
            const plan = session.metadata.plan;

            const durationDays = plan === "MONTHLY" ? 30 : 365;

            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + durationDays);

            console.log({ session });

            // await prisma.subscription.create({
            //     data: {
            //         userId,
            //         plan,
            //         status: "ACTIVE",
            //         startDate,
            //         endDate,
            //         stripeSubscriptionId: session.subscription,
            //     },
            // });

            await prisma.$transaction([
                prisma.subscription.create({
                    data: {
                        userId,
                        plan,
                        status: "ACTIVE",
                        startDate,
                        endDate,
                        stripeSubscriptionId: session.subscription,
                    },
                }),
                prisma.user.update({
                    where: { id: userId },
                    data: { isVerified: true },
                }),
            ]);
        }

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Webhook request send successfully!',
            // data: result,
        });
    });

    // handleWebhook = catchAsync(async (req: Request, res: Response) => {
    //     await paymentService.handlePaymentWebhook(req.body);

    //     sendResponse(res, {
    //         statusCode: StatusCodes.OK,
    //         success: true,
    //         message: 'Webhook processed successfully',
    //         data: null,
    //     });
    // });

    // getMySubscription = catchAsync(async (req: Request, res: Response) => {
    //     const userId = (req as any).user.id;
    //     const result = await paymentService.getMySubscription(userId);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: 'Subscription retrieved successfully',
    //         data: result,
    //     });
    // });

    // cancelSubscription = catchAsync(async (req: Request, res: Response) => {
    //     const userId = (req as any).user.id;
    //     const { reason } = req.body;
    //     await paymentService.cancelSubscription(userId, reason);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: 'Subscription cancelled successfully',
    //         data: null,
    //     });
    // });

    // getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
    //     const userId = (req as any).user.id;
    //     const result = await paymentService.getPaymentHistory(userId, req.query);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: 'Payment history retrieved successfully',
    //         data: result.data,
    //         meta: result.meta,
    //     });
    // });
}

export default new PaymentController();