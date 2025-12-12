"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const enums_1 = require("@prisma/enums");
const ApiError_1 = __importDefault(require("app/errors/ApiError"));
const paginationHelper_1 = require("app/helper/paginationHelper");
const prisma_1 = require("app/lib/prisma");
const http_status_codes_1 = require("http-status-codes");
// import ApiError from "src/app/errors/ApiError";
// import { calculatePagination } from "src/app/helper/paginationHelper";
// import { prisma } from "src/app/lib/prisma";
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
            prisma_1.prisma.user.count(),
            prisma_1.prisma.user.count({ where: { isActive: true } }),
            // prisma.user.count({
            //     where: {
            //         createdAt: { gte: firstDayOfMonth },
            //     },
            // }),
            prisma_1.prisma.subscription.count({
                where: {
                    status: enums_1.SubscriptionStatus.ACTIVE,
                    endDate: { gte: now },
                },
            }),
        ]);
        // Travel plans stats
        const [totalPlans, activePlans, completedPlans, plansThisMonth] = await Promise.all([
            prisma_1.prisma.travelPlan.count({ where: { isDeleted: false } }),
            prisma_1.prisma.travelPlan.count({
                where: {
                    isDeleted: false,
                    status: { in: [enums_1.TripStatus.PLANNING, enums_1.TripStatus.UPCOMING, enums_1.TripStatus.ONGOING] },
                },
            }),
            prisma_1.prisma.travelPlan.count({
                where: {
                    isDeleted: false,
                    status: enums_1.TripStatus.COMPLETED,
                },
            }),
            prisma_1.prisma.travelPlan.count({
                where: {
                    isDeleted: false,
                    createdAt: { gte: firstDayOfMonth },
                },
            }),
        ]);
        // Revenue stats
        const [revenueThisMonth, revenueLastMonth] = await Promise.all([
            prisma_1.prisma.payment.aggregate({
                where: {
                    status: 'COMPLETED',
                    createdAt: {
                        gte: firstDayOfMonth,
                        lte: now,
                    },
                },
                _sum: { amount: true },
            }),
            prisma_1.prisma.payment.aggregate({
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
        const totalRevenue = await prisma_1.prisma.payment.aggregate({
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
            prisma_1.prisma.review.count(),
            prisma_1.prisma.review.count({
                where: {
                    createdAt: { gte: firstDayOfMonth },
                },
            }),
            prisma_1.prisma.review.aggregate({
                _avg: { rating: true },
            }),
        ]);
        // Requests stats
        const [pendingRequests, acceptedRequests, rejectedRequests] = await Promise.all([
            prisma_1.prisma.travelRequest.count({ where: { status: enums_1.RequestStatus.PENDING } }),
            prisma_1.prisma.travelRequest.count({ where: { status: enums_1.RequestStatus.ACCEPTED } }),
            prisma_1.prisma.travelRequest.count({ where: { status: enums_1.RequestStatus.REJECTED } }),
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
    async getAllUsers(query, options) {
        const { search, role, isActive, isVerified, } = query;
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(options);
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                // { profile: { fullName: { contains: search, mode: 'insensitive' } } },
                { fullName: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (role)
            where.role = role;
        if (isActive !== undefined)
            where.isActive = isActive === 'true';
        if (isVerified !== undefined)
            where.isVerified = isVerified === 'true';
        const [total, users] = await Promise.all([
            prisma_1.prisma.user.count({ where }),
            prisma_1.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    _count: {
                        select: {
                            travelPlans: true,
                            reviewsReceived: true,
                            payments: true,
                        },
                    },
                },
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
    async manageUser(adminId, actionData) {
        const { userId, action, reason } = actionData;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        // Cannot perform action on yourself
        if (userId === adminId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Cannot perform action on yourself');
        }
        // Cannot manage other admins
        if (user.role === 'ADMIN') {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Cannot manage admin users');
        }
        let result;
        switch (action) {
            case 'BLOCK':
                result = await prisma_1.prisma.user.update({
                    where: { id: userId },
                    data: { isActive: false },
                });
                break;
            case 'UNBLOCK':
                result = await prisma_1.prisma.user.update({
                    where: { id: userId },
                    data: { isActive: true },
                });
                break;
            case 'DELETE':
                // Soft delete by deactivating
                result = await prisma_1.prisma.user.update({
                    where: { id: userId },
                    data: { isDeleted: false },
                });
                break;
            case 'VERIFY':
                await prisma_1.prisma.user.update({
                    where: { id: userId },
                    data: { isVerified: true },
                });
                result = await prisma_1.prisma.user.findUnique({
                    where: { id: userId },
                    // include: { profile: true },
                });
                break;
        }
        // Log the action
        // await prisma.activityLog.create({
        //     data: {
        //         userId: adminId,
        //         action: `USER_${action}`,
        //         entityType: 'user',
        //         entityId: userId,
        //         description: reason || `Admin ${action.toLowerCase()}ed user ${user.email}`,
        //     },
        // });
        // Notify user
        // await prisma.notification.create({
        //     data: {
        //         userId,
        //         title: `Account ${action.toLowerCase()}`,
        //         message: reason || `Your account has been ${action.toLowerCase()}ed by admin`,
        //         type: 'admin_action',
        //     },
        // });
        return result;
    }
    // async moderateContent(adminId: string, moderationData: any) {
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
    //         // await prisma.notification.create({
    //         //     data: {
    //         //         userId: plan.userId,
    //         //         title: 'Travel Plan Removed',
    //         //         message: reason || 'Your travel plan has been removed by admin',
    //         //         type: 'admin_action',
    //         //     },
    //         // });
    //     }
    //     // Log action
    //     // await prisma.activityLog.create({
    //     //     data: {
    //     //         userId: adminId,
    //     //         action: `TRAVEL_PLAN_${action}`,
    //     //         entityType: 'travel_plan',
    //     //         entityId: planId,
    //     //         description: reason || `Admin ${action.toLowerCase()}ed travel plan`,
    //     //     },
    //     // });
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
    async getAnalytics(query) {
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
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid analytics type');
        }
    }
    async getUserAnalytics(startDate, endDate, groupBy) {
        const users = await prisma_1.prisma.user.findMany({
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
    async getTravelPlanAnalytics(startDate, endDate, groupBy) {
        const plans = await prisma_1.prisma.travelPlan.findMany({
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
    async getReviewAnalytics(startDate, endDate, groupBy) {
        const reviews = await prisma_1.prisma.review.findMany({
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
    groupByDate(data, dateField, groupBy, sumAmount = false) {
        const grouped = {};
        data.forEach((item) => {
            const date = new Date(item[dateField]);
            let key;
            if (groupBy === 'DAY') {
                key = date.toISOString().split('T')[0];
            }
            else if (groupBy === 'WEEK') {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
            }
            else {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
            if (!grouped[key]) {
                grouped[key] = sumAmount ? 0 : 0;
            }
            if (sumAmount) {
                grouped[key] += Number(item.amount);
            }
            else {
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
    async getAllTravelPlans(query, options) {
        const { search, status, } = query;
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(options);
        const where = { isDeleted: false };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { destination: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status)
            where.status = status;
        const [total, plans] = await Promise.all([
            prisma_1.prisma.travelPlan.count({ where }),
            prisma_1.prisma.travelPlan.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    user: {
                        select: {
                            fullName: true,
                            profileImage: true,
                        },
                    },
                    _count: {
                        select: {
                            requests: true,
                        },
                    },
                },
            }),
        ]);
        return {
            data: plans,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
exports.default = new AdminService();
