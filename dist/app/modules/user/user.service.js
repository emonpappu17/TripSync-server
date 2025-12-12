"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../helper/paginationHelper");
// import ApiError from "src/app/errors/ApiError";
// import { calculatePagination, IOptions } from "src/app/helper/paginationHelper";
// import { prisma } from "src/app/lib/prisma";
/* eslint-disable @typescript-eslint/no-explicit-any */
class UserService {
    async updateProfile(userId, updateData) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                ...updateData,
            },
            select: {
                fullName: true,
                profileImage: true,
                bio: true,
                email: true,
            }
        });
        return updatedUser;
    }
    async getAllUsers(query, options) {
        const { search, role, isActive, } = query;
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(options);
        // Build where clause
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (role) {
            where.role = role;
        }
        if (isActive !== undefined) {
            where.isActive = query.isActive === "true";
        }
        // Get total count
        const total = await prisma_1.prisma.user.count({ where });
        // Get users
        const users = await prisma_1.prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        });
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
    async getUserById(id) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                profileImage: true,
                bio: true,
                phone: true,
                role: true,
                isVerified: true,
                currentLocation: true,
                gender: true,
                interests: true,
                visitedCountries: true,
                email: true,
                // Stats
                _count: {
                    select: {
                        travelPlans: {
                            where: {
                                status: "COMPLETED",
                            },
                        },
                        reviewsGiven: true,
                        reviewsReceived: true,
                        sentRequests: true,
                    },
                },
                reviewsReceived: {
                    select: { rating: true },
                },
            },
        });
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        // Calculate average rating
        const avgRating = user.reviewsReceived.length > 0
            ? user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
                user.reviewsReceived.length
            : 0;
        return {
            ...user,
            stats: {
                travelPlansCount: user._count.travelPlans,
                reviewsGivenCount: user._count.reviewsGiven,
                reviewsReceivedCount: user._count.reviewsReceived,
                requestsSentCount: user._count.sentRequests,
                averageRating: Math.round(avgRating * 10) / 10,
            },
        };
    }
    async getUserStats(userId) {
        const stats = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: {
                        travelPlans: true,
                        reviewsGiven: true,
                        reviewsReceived: true,
                        sentRequests: true,
                    },
                },
                reviewsReceived: {
                    select: { rating: true },
                },
            },
        });
        if (!stats) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        // Calculate average rating
        const avgRating = stats.reviewsReceived.length > 0
            ? stats.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
                stats.reviewsReceived.length
            : 0;
        return {
            travelPlansCount: stats._count.travelPlans,
            reviewsGivenCount: stats._count.reviewsGiven,
            reviewsReceivedCount: stats._count.reviewsReceived,
            requestsSentCount: stats._count.sentRequests,
            averageRating: Math.round(avgRating * 10) / 10,
        };
    }
    async deleteUser(id) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        // Soft delete - just deactivate
        await prisma_1.prisma.user.update({
            where: { id },
            data: { isDeleted: true },
        });
        // For hard delete, use:
        // await prisma.user.delete({ where: { id } });
    }
    async changeUserStatus(id, updateData) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: id },
            data: {
                ...updateData,
            },
            select: {
                fullName: true,
                profileImage: true,
                bio: true,
                email: true,
                isActive: true,
            }
        });
        return updatedUser;
    }
}
exports.default = new UserService();
