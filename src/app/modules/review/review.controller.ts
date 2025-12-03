/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import reviewService from "./review.service";

class ReviewController {
    createReview = catchAsync(async (req: Request, res: Response) => {
        const fromReviewerId = (req as any).user.id;
        const result = await reviewService.createReview(fromReviewerId, req.body);

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Review created successfully',
            data: result,
        });
    });

    getUserReviews = catchAsync(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const result = await reviewService.getUserReviews(userId, req.query);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Reviews retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });

    // updateReview = catchAsync(async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const reviewerId = (req as any).user.id;
    //     const result = await reviewService.updateReview(id, reviewerId, req.body);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: 'Review updated successfully',
    //         data: result,
    //     });
    // });

    // deleteReview = catchAsync(async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const reviewerId = (req as any).user.id;
    //     await reviewService.deleteReview(id, reviewerId);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: 'Review deleted successfully',
    //         data: null,
    //     });
    // });
}

export default new ReviewController();