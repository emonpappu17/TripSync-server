/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import paymentService from "./payment.service";

class PaymentController {
    createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const result = await paymentService.createPaymentIntent(userId, req.body);

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Payment intent created successfully',
            data: result,
        });
    });

    handleWebhook = catchAsync(async (req: Request, res: Response) => {
        await paymentService.handlePaymentWebhook(req.body);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Webhook processed successfully',
            data: null,
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

export default new PaymentController();