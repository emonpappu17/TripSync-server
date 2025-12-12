"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const review_service_1 = __importDefault(require("./review.service"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// import catchAsync from "src/app/utils/catchAsync";
// import sendResponse from "src/app/utils/sendResponse";
class ReviewController {
    createReview = (0, catchAsync_1.default)(async (req, res) => {
        const fromReviewerId = req.user.id;
        const result = await review_service_1.default.createReview(fromReviewerId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'Review created successfully',
            data: result,
        });
    });
    getMyReviews = (0, catchAsync_1.default)(async (req, res) => {
        const userId = req?.user?.id;
        const result = await review_service_1.default.getUserReviews(userId, req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Reviews retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
    getUserReviews = (0, catchAsync_1.default)(async (req, res) => {
        const { userId } = req.params;
        const result = await review_service_1.default.getUserReviews(userId, req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Reviews retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
    updateReview = (0, catchAsync_1.default)(async (req, res) => {
        const { id } = req.params;
        const reviewerId = req.user.id;
        const result = await review_service_1.default.updateReview(id, reviewerId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Review updated successfully',
            data: result,
        });
    });
    deleteReview = (0, catchAsync_1.default)(async (req, res) => {
        const { id } = req.params;
        const reviewerId = req.user.id;
        await review_service_1.default.deleteReview(id, reviewerId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Review deleted successfully',
            data: null,
        });
    });
}
exports.default = new ReviewController();
