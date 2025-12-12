import { StatusCodes } from "http-status-codes";
import reviewService from "./review.service";
import catchAsync from "src/app/utils/catchAsync";
import sendResponse from "src/app/utils/sendResponse";
class ReviewController {
    constructor() {
        this.createReview = catchAsync(async (req, res) => {
            const fromReviewerId = req.user.id;
            const result = await reviewService.createReview(fromReviewerId, req.body);
            sendResponse(res, {
                statusCode: StatusCodes.CREATED,
                success: true,
                message: 'Review created successfully',
                data: result,
            });
        });
        this.getMyReviews = catchAsync(async (req, res) => {
            const userId = req.user?.id;
            const result = await reviewService.getUserReviews(userId, req.query);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Reviews retrieved successfully',
                data: result.data,
                meta: result.meta,
            });
        });
        this.getUserReviews = catchAsync(async (req, res) => {
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
        this.updateReview = catchAsync(async (req, res) => {
            const { id } = req.params;
            const reviewerId = req.user.id;
            const result = await reviewService.updateReview(id, reviewerId, req.body);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Review updated successfully',
                data: result,
            });
        });
        this.deleteReview = catchAsync(async (req, res) => {
            const { id } = req.params;
            const reviewerId = req.user.id;
            await reviewService.deleteReview(id, reviewerId);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Review deleted successfully',
                data: null,
            });
        });
    }
}
export default new ReviewController();
