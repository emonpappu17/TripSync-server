/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import paymentService from "./payment.service";
import { stripe } from "app/config/stripe";
import envVars from "app/config/env";
// import catchAsync from "app/utils/catchAsync";
// import catchAsync from "src/app/utils/catchAsync";
// import sendResponse from "src/app/utils/sendResponse";
// import { stripe } from "src/app/config/stripe";
// import envVars from "src/app/config/env";
// import { prisma } from "src/app/lib/prisma";
import { prisma } from "app/lib/prisma";
class PaymentController {
    createCheckoutSession = catchAsync(async (req, res) => {
        const userId = req.user.id;
        const result = await paymentService.createCheckoutSession(userId, req.body);
        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'createCheckoutSession created successfully',
            data: result,
        });
    });
    stripeWebhook = catchAsync(async (req, res) => {
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
}
export default new PaymentController();
