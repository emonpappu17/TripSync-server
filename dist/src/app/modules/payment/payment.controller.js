import { StatusCodes } from "http-status-codes";
import paymentService from "./payment.service";
import catchAsync from "src/app/utils/catchAsync";
import sendResponse from "src/app/utils/sendResponse";
import { stripe } from "src/app/config/stripe";
import envVars from "src/app/config/env";
import { prisma } from "src/app/lib/prisma";
// import { prisma } from "app/lib/prisma";
class PaymentController {
    constructor() {
        this.createCheckoutSession = catchAsync(async (req, res) => {
            const userId = req.user.id;
            const result = await paymentService.createCheckoutSession(userId, req.body);
            sendResponse(res, {
                statusCode: StatusCodes.CREATED,
                success: true,
                message: 'createCheckoutSession created successfully',
                data: result,
            });
        });
        this.stripeWebhook = catchAsync(async (req, res) => {
            let event;
            try {
                event = await stripe.webhooks.constructEventAsync(req.body, req.headers["stripe-signature"], envVars.STRIPE_WEBHOOK_SECRET);
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
            });
        });
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
}
export default new PaymentController();
