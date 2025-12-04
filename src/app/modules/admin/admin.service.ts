/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestStatus, SubscriptionStatus, TripStatus } from "@prisma/enums";
import ApiError from "app/errors/ApiError";
import { calculatePagination } from "app/helper/paginationHelper";
import { prisma } from "app/lib/prisma";
import { StatusCodes } from "http-status-codes";

class AdminService {
    async getDashboardStats() {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Users stats
        const [totalUsers, activeUsers,
            // newUsersThisMonth,
            premiumUsers] = await Promise.all([
                prisma.user.count(),
                prisma.user.count({ where: { isActive: true } }),
                // prisma.user.count({
                //     where: {
                //         createdAt: { gte: firstDayOfMonth },
                //     },
                // }),
                prisma.subscription.count({
                    where: {
                        status: SubscriptionStatus.ACTIVE,
                        endDate: { gte: now },
                    },
                }),
            ]);

        // Travel plans stats
        const [totalPlans, activePlans, completedPlans,
            plansThisMonth
        ] = await Promise.all([
            prisma.travelPlan.count({ where: { isDeleted: false } }),
            prisma.travelPlan.count({
                where: {
                    isDeleted: false,
                    status: { in: [TripStatus.PLANNING, TripStatus.UPCOMING, TripStatus.ONGOING] },
                },
            }),
            prisma.travelPlan.count({
                where: {
                    isDeleted: false,
                    status: TripStatus.COMPLETED,
                },
            }),
            prisma.travelPlan.count({
                where: {
                    isDeleted: false,
                    createdAt: { gte: firstDayOfMonth },
                },
            }),
        ]);

        // Revenue stats
        const [revenueThisMonth, revenueLastMonth] = await Promise.all([
            prisma.payment.aggregate({
                where: {
                    status: 'COMPLETED',
                    createdAt: {
                        gte: firstDayOfMonth,
                        lte: now,
                    },
                },
                _sum: { amount: true },
            }),
            prisma.payment.aggregate({
                where: {
                    status: 'COMPLETED',
                    createdAt: {
                        gte: lastMonth,
                        lte: endOfLastMonth,
                    },
                },
                _sum: { amount: true },
            }),
        ]);

        const totalRevenue = await prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true },
        });

        const thisMonthRevenue = Number(revenueThisMonth._sum.amount || 0);
        const lastMonthRevenue = Number(revenueLastMonth._sum.amount || 0);
        const revenueGrowth = lastMonthRevenue > 0
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

        // Reviews stats
        const [totalReviews, reviewsThisMonth, avgRating] = await Promise.all([
            prisma.review.count(),
            prisma.review.count({
                where: {
                    createdAt: { gte: firstDayOfMonth },
                },
            }),
            prisma.review.aggregate({
                _avg: { rating: true },
            }),
        ]);

        // Requests stats
        const [pendingRequests, acceptedRequests, rejectedRequests] = await Promise.all([
            prisma.travelRequest.count({ where: { status: RequestStatus.PENDING } }),
            prisma.travelRequest.count({ where: { status: RequestStatus.ACCEPTED } }),
            prisma.travelRequest.count({ where: { status: RequestStatus.REJECTED } }),
        ]);

        return {
            users: {
                total: totalUsers,
                active: activeUsers,
                // newThisMonth: newUsersThisMonth,
                premium: premiumUsers,
            },
            travelPlans: {
                total: totalPlans,
                active: activePlans,
                completed: completedPlans,
                thisMonth: plansThisMonth,
            },
            revenue: {
                total: Number(totalRevenue._sum.amount || 0),
                thisMonth: thisMonthRevenue,
                lastMonth: lastMonthRevenue,
                growth: Math.round(revenueGrowth * 100) / 100,
            },
            reviews: {
                total: totalReviews,
                averageRating: Math.round((avgRating._avg.rating || 0) * 10) / 10,
                thisMonth: reviewsThisMonth,
            },
            requests: {
                pending: pendingRequests,
                accepted: acceptedRequests,
                rejected: rejectedRequests,
            },
        };
    }

    async getAllUsers(query: any, options: any) {
        const {
            // page = 1,
            // limit = 20,
            search,
            role,
            isActive,
            isVerified,
            // sortBy = 'createdAt',
            // sortOrder = 'desc',
        } = query;

        // const skip = (page - 1) * limit;
        const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options)
        const where: any = {};

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                // { profile: { fullName: { contains: search, mode: 'insensitive' } } },
                { fullName: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (role) where.role = role;
        if (isActive !== undefined) where.isActive = isActive === 'true';

        if (isVerified !== undefined) {
            where.profile = {
                ...where.profile,
                isVerified: isVerified === 'true',
            };
        }

        const [total, users] = await Promise.all([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    // profile: {
                    //     select: {
                    //         fullName: true,
                    //         profileImage: true,
                    //         isVerified: true,
                    //         completionScore: true,
                    //         currentLocation: true,
                    //     },
                    // },

                    _count: {
                        select: {
                            // fullName: true,
                            // profileImage: true,
                            // isVerified: true,
                            // // completionScore: true,
                            // currentLocation: true,
                            travelPlans: true,
                            reviewsReceived: true,
                            payments: true,
                        },
                    },
                },

                // select: {
                //     fullName: true,
                //     profileImage: true,
                //     isVerified: true,
                //     // completionScore: true,
                //     currentLocation: true,
                // },
                // _count: {
                //     select: {
                //         travelPlans: true,
                //         reviewsReceived: true,
                //         payments: true,
                //     },
                // },
            }),
        ]);

        return {
            data: users,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // async manageUser(adminId: string, actionData: IUserManagement) {
    //     const { userId, action, reason } = actionData;

    //     const user = await prisma.user.findUnique({
    //         where: { id: userId },
    //         include: { profile: true },
    //     });

    //     if (!user) {
    //         throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    //     }

    //     // Cannot perform action on yourself
    //     if (userId === adminId) {
    //         throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot perform action on yourself');
    //     }

    //     // Cannot manage other admins
    //     if (user.role === 'ADMIN') {
    //         throw new ApiError(httpStatus.FORBIDDEN, 'Cannot manage admin users');
    //     }

    //     let result;

    //     switch (action) {
    //         case 'BLOCK':
    //             result = await prisma.user.update({
    //                 where: { id: userId },
    //                 data: { isActive: false },
    //             });
    //             break;

    //         case 'UNBLOCK':
    //             result = await prisma.user.update({
    //                 where: { id: userId },
    //                 data: { isActive: true },
    //             });
    //             break;

    //         case 'DELETE':
    //             // Soft delete by deactivating
    //             result = await prisma.user.update({
    //                 where: { id: userId },
    //                 data: { isActive: false },
    //             });
    //             break;

    //         case 'VERIFY':
    //             await prisma.profile.update({
    //                 where: { userId },
    //                 data: { isVerified: true },
    //             });
    //             result = await prisma.user.findUnique({
    //                 where: { id: userId },
    //                 include: { profile: true },
    //             });
    //             break;
    //     }

    //     // Log the action
    //     await prisma.activityLog.create({
    //         data: {
    //             userId: adminId,
    //             action: `USER_${action}`,
    //             entityType: 'user',
    //             entityId: userId,
    //             description: reason || `Admin ${action.toLowerCase()}ed user ${user.email}`,
    //         },
    //     });

    //     // Notify user
    //     await prisma.notification.create({
    //         data: {
    //             userId,
    //             title: `Account ${action.toLowerCase()}`,
    //             message: reason || `Your account has been ${action.toLowerCase()}ed by admin`,
    //             type: 'admin_action',
    //         },
    //     });

    //     return result;
    // }

    // async moderateContent(adminId: string, moderationData: IContentModeration) {
    //     const { entityType, entityId, action, reason } = moderationData;

    //     switch (entityType) {
    //         case 'TRAVEL_PLAN':
    //             return this.moderateTravelPlan(adminId, entityId, action, reason);
    //         case 'REVIEW':
    //             return this.moderateReview(adminId, entityId, action, reason);
    //         default:
    //             throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid entity type');
    //     }
    // }

    // private async moderateTravelPlan(adminId: string, planId: string, action: string, reason?: string) {
    //     const plan = await prisma.travelPlan.findUnique({
    //         where: { id: planId },
    //         include: { user: true },
    //     });

    //     if (!plan) {
    //         throw new ApiError(httpStatus.NOT_FOUND, 'Travel plan not found');
    //     }

    //     if (action === 'DELETE') {
    //         await prisma.travelPlan.update({
    //             where: { id: planId },
    //             data: { deletedAt: new Date() },
    //         });

    //         // Notify creator
    //         await prisma.notification.create({
    //             data: {
    //                 userId: plan.userId,
    //                 title: 'Travel Plan Removed',
    //                 message: reason || 'Your travel plan has been removed by admin',
    //                 type: 'admin_action',
    //             },
    //         });
    //     }

    //     // Log action
    //     await prisma.activityLog.create({
    //         data: {
    //             userId: adminId,
    //             action: `TRAVEL_PLAN_${action}`,
    //             entityType: 'travel_plan',
    //             entityId: planId,
    //             description: reason || `Admin ${action.toLowerCase()}ed travel plan`,
    //         },
    //     });

    //     return plan;
    // }

    // private async moderateReview(adminId: string, reviewId: string, action: string, reason?: string) {
    //     const review = await prisma.review.findUnique({
    //         where: { id: reviewId },
    //         include: { reviewer: true, reviewee: true },
    //     });

    //     if (!review) {
    //         throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    //     }

    //     if (action === 'DELETE') {
    //         await prisma.review.delete({
    //             where: { id: reviewId },
    //         });

    //         // Notify reviewer
    //         await prisma.notification.create({
    //             data: {
    //                 userId: review.reviewerId,
    //                 title: 'Review Removed',
    //                 message: reason || 'Your review has been removed by admin',
    //                 type: 'admin_action',
    //             },
    //         });
    //     }

    //     // Log action
    //     await prisma.activityLog.create({
    //         data: {
    //             userId: adminId,
    //             action: `REVIEW_${action}`,
    //             entityType: 'review',
    //             entityId: reviewId,
    //             description: reason || `Admin ${action.toLowerCase()}ed review`,
    //         },
    //     });

    //     return review;
    // }

    async getAnalytics(query: any) {
        const { startDate, endDate, type, groupBy = 'DAY' } = query;

        const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate || new Date();

        switch (type) {
            case 'USERS':
                return this.getUserAnalytics(start, end, groupBy);
            // case 'REVENUE':
            //     return this.getRevenueAnalytics(start, end, groupBy);
            case 'TRAVEL_PLANS':
                return this.getTravelPlanAnalytics(start, end, groupBy);
            case 'REVIEWS':
                return this.getReviewAnalytics(start, end, groupBy);
            default:
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid analytics type');
        }
    }

    private async getUserAnalytics(startDate: Date, endDate: Date, groupBy: string) {
        const users = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                createdAt: true,
                role: true,
            },
        });

        return this.groupByDate(users, 'createdAt', groupBy);
    }

    // private async getRevenueAnalytics(startDate: Date, endDate: Date, groupBy: string) {
    //     const payments = await prisma.payment.findMany({
    //         where: {
    //             status: 'COMPLETED',
    //             paidAt: {
    //                 gte: startDate,
    //                 lte: endDate,
    //             },
    //         },
    //         select: {
    //             paidAt: true,
    //             amount: true,
    //         },
    //     });

    //     return this.groupByDate(payments, 'paidAt', groupBy, true);
    // }

    private async getTravelPlanAnalytics(startDate: Date, endDate: Date, groupBy: string) {
        const plans = await prisma.travelPlan.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                isDeleted: false,
            },
            select: {
                createdAt: true,
                status: true,
            },
        });

        return this.groupByDate(plans, 'createdAt', groupBy);
    }

    private async getReviewAnalytics(startDate: Date, endDate: Date, groupBy: string) {
        const reviews = await prisma.review.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                createdAt: true,
                rating: true,
            },
        });

        return this.groupByDate(reviews, 'createdAt', groupBy);
    }

    private groupByDate(data: any[], dateField: string, groupBy: string, sumAmount = false) {
        const grouped: any = {};

        data.forEach((item) => {
            const date = new Date(item[dateField]);
            let key: string;

            if (groupBy === 'DAY') {
                key = date.toISOString().split('T')[0];
            } else if (groupBy === 'WEEK') {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
            } else {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }

            if (!grouped[key]) {
                grouped[key] = sumAmount ? 0 : 0;
            }

            if (sumAmount) {
                grouped[key] += Number(item.amount);
            } else {
                grouped[key]++;
            }
        });

        return Object.keys(grouped)
            .sort()
            .map((date) => ({
                date,
                value: grouped[date],
            }));
    }

    // async getActivityLogs(query: any) {
    //     const { page = 1, limit = 50, action, userId, startDate, endDate } = query;
    //     const skip = (page - 1) * limit;

    //     const where: any = {};

    //     if (action) where.action = action;
    //     if (userId) where.userId = userId;
    //     if (startDate || endDate) {
    //         where.createdAt = {};
    //         if (startDate) where.createdAt.gte = new Date(startDate);
    //         if (endDate) where.createdAt.lte = new Date(endDate);
    //     }

    //     const [total, logs] = await Promise.all([
    //         prisma.activityLog.count({ where }),
    //         prisma.activityLog.findMany({
    //             where,
    //             skip,
    //             take: limit,
    //             orderBy: { createdAt: 'desc' },
    //             include: {
    //                 user: {
    //                     select: {
    //                         email: true,
    //                         profile: {
    //                             select: { fullName: true },
    //                         },
    //                     },
    //                 },
    //             },
    //         }),
    //     ]);

    //     return {
    //         data: logs,
    //         meta: {
    //             page,
    //             limit,
    //             total,
    //             totalPages: Math.ceil(total / limit),
    //         },
    //     };
    // }

    // async getAllTravelPlans(query: any) {
    //     const {
    //         page = 1,
    //         limit = 20,
    //         search,
    //         status,
    //         sortBy = 'createdAt',
    //         sortOrder = 'desc',
    //     } = query;

    //     const skip = (page - 1) * limit;
    //     const where: any = { deletedAt: null };

    //     if (search) {
    //         where.OR = [
    //             { title: { contains: search, mode: 'insensitive' } },
    //             { destination: { contains: search, mode: 'insensitive' } },
    //         ];
    //     }

    //     if (status) where.status = status;

    //     const [total, plans] = await Promise.all([
    //         prisma.travelPlan.count({ where }),
    //         prisma.travelPlan.findMany({
    //             where,
    //             skip,
    //             take: limit,
    //             orderBy: { [sortBy]: sortOrder },
    //             include: {
    //                 user: {
    //                     include: {
    //                         profile: {
    //                             select: {
    //                                 fullName: true,
    //                                 profileImage: true,
    //                             },
    //                         },
    //                     },
    //                 },
    //                 _count: {
    //                     select: {
    //                         requests: true,
    //                         activities: true,
    //                     },
    //                 },
    //             },
    //         }),
    //     ]);

    //     return {
    //         data: plans,
    //         meta: {
    //             page,
    //             limit,
    //             total,
    //             totalPages: Math.ceil(total / limit),
    //         },
    //     };
    // }
}

export default new AdminService();