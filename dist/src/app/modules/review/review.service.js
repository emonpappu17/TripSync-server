"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const ApiError_1 = __importDefault(require("app/errors/ApiError"));
const prisma_1 = require("app/lib/prisma");
const http_status_codes_1 = require("http-status-codes");
// import ApiError from "src/app/errors/ApiError";
// import { prisma } from "src/app/lib/prisma";
class ReviewService {
    async createReview(fromReviewerId, reviewData) {
        // Check if users exist
        const [fromReviewer, toReviewer] = await Promise.all([
            prisma_1.prisma.user.findUnique({ where: { id: fromReviewerId } }),
            prisma_1.prisma.user.findUnique({ where: { id: reviewData.toReviewerId } }),
        ]);
        if (!fromReviewer || !toReviewer) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        // Cannot review yourself
        if (fromReviewerId === reviewData.fromReviewerId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Cannot review yourself');
        }
        // Check if review already exists
        const existingReview = await prisma_1.prisma.review.findUnique({
            where: {
                fromReviewerId_toReviewerId: {
                    fromReviewerId,
                    toReviewerId: reviewData.toReviewerId,
                },
            },
        });
        if (existingReview) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You have already reviewed this user. You can update your existing review.');
        }
        const review = await prisma_1.prisma.review.create({
            data: {
                fromReviewerId,
                ...reviewData,
            },
            include: {
                formReviewer: {
                    select: {
                        fullName: true,
                        profileImage: true,
                    }
                }
            },
        });
        return review;
    }
    async getUserReviews(userId, query) {
        const { page = 1, limit = 10 } = query;
        const convertedPage = Number(page);
        const convertedLimit = Number(limit);
        const skip = (convertedPage - 1) * convertedLimit;
        // console.log({ userId });
        const [total, reviews] = await Promise.all([
            prisma_1.prisma.review.count({
                where: {
                    toReviewerId: userId,
                    isPublic: true,
                },
            }),
            prisma_1.prisma.review.findMany({
                where: {
                    toReviewerId: userId,
                    isPublic: true,
                },
                skip,
                take: convertedLimit,
                orderBy: { createdAt: 'desc' },
                include: {
                    // formReviewer: {
                    //     include: {
                    //         profile: {
                    //             select: {
                    //                 fullName: true,
                    //                 profileImage: true,
                    //             },
                    //         },
                    //     },
                    // },
                    tourPlanReview: {
                        select: {
                            destination: true,
                            country: true
                        }
                    },
                    formReviewer: {
                        select: {
                            fullName: true,
                            profileImage: true,
                        }
                    }
                },
            }),
        ]);
        // Calculate average rating
        const avgRating = await prisma_1.prisma.review.aggregate({
            where: { toReviewerId: userId },
            _avg: { rating: true },
        });
        return {
            data: reviews,
            meta: {
                page: convertedPage,
                limit: convertedLimit,
                total,
                totalPages: Math.ceil(total / convertedLimit),
                averageRating: avgRating._avg.rating || 0,
            },
        };
    }
    async updateReview(reviewId, reviewerId, updateData) {
        const review = await prisma_1.prisma.review.findFirst({
            where: {
                id: reviewId,
                fromReviewerId: reviewerId,
            },
        });
        if (!review) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found');
        }
        const updated = await prisma_1.prisma.review.update({
            where: { id: reviewId },
            data: updateData,
        });
        return updated;
    }
    async deleteReview(reviewId, reviewerId) {
        const review = await prisma_1.prisma.review.findFirst({
            where: {
                id: reviewId,
                fromReviewerId: reviewerId,
            },
        });
        if (!review) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found');
        }
        await prisma_1.prisma.review.delete({
            where: { id: reviewId },
        });
    }
}
exports.default = new ReviewService();
