/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiError from "app/errors/ApiError";
import { prisma } from "app/lib/prisma";
import { StatusCodes } from "http-status-codes";

class ReviewService {
    async createReview(fromReviewerId: string, reviewData: any) {
        // Check if users exist
        const [fromReviewer, toReviewer] = await Promise.all([
            prisma.user.findUnique({ where: { id: fromReviewerId } }),
            prisma.user.findUnique({ where: { id: reviewData.toReviewerId } }),
        ]);

        if (!fromReviewer || !toReviewer) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
        }

        // Cannot review yourself
        if (fromReviewerId === reviewData.fromReviewerId) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot review yourself');
        }

        // Check if review already exists
        const existingReview = await prisma.review.findUnique({
            where: {
                fromReviewerId_toReviewerId: {
                    fromReviewerId,
                    toReviewerId: reviewData.toReviewerId as string,
                },
            },
        });

        if (existingReview) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'You have already reviewed this user. You can update your existing review.'
            );
        }

        const review = await prisma.review.create({
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

    async getUserReviews(userId: string, query: any) {
        const { page = 1, limit = 10 } = query;
        const convertedPage = Number(page);
        const convertedLimit = Number(limit);

        const skip = (convertedPage - 1) * convertedLimit;

        console.log({ userId });


        const [total, reviews] = await Promise.all([
            prisma.review.count({
                where: {
                    toReviewerId: userId,
                    isPublic: true,
                },
            }),
            prisma.review.findMany({
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
        const avgRating = await prisma.review.aggregate({
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

    async updateReview(reviewId: string, reviewerId: string, updateData: any) {
        const review = await prisma.review.findFirst({
            where: {
                id: reviewId,
                fromReviewerId: reviewerId,
            },
        });

        if (!review) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
        }

        const updated = await prisma.review.update({
            where: { id: reviewId },
            data: updateData,
        });

        return updated;
    }

    async deleteReview(reviewId: string, reviewerId: string) {
        const review = await prisma.review.findFirst({
            where: {
                id: reviewId,
                fromReviewerId: reviewerId,
            },
        });

        if (!review) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
        }

        await prisma.review.delete({
            where: { id: reviewId },
        });
    }
}

export default new ReviewService();