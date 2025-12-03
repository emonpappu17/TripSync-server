/* eslint-disable @typescript-eslint/no-explicit-any */
// import { TravelPlan } from "@prisma/client";
import { TravelPlan } from "@prisma/client";
import ApiError from "app/errors/ApiError";
import { calculatePagination, IOptions } from "app/helper/paginationHelper";
import { prisma } from "app/lib/prisma";
import { StatusCodes } from "http-status-codes";

class TravelPlanService {
    async createTravelPlan(userId: string, planData: any) {
        const travelPlan = await prisma.travelPlan.create({
            data: {
                userId,
                ...planData
            },
        });

        return travelPlan;
    }

    async getTravelPlans(query: any, options: IOptions) {
        const {
            search,
            country,
            destination,
            startDate,
            endDate,
            budgetMin,
            budgetMax,
            travelType,
            status,
            userId,
        } = query;
        const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options)

        const where: any = {
            isDeleted: false,
            isPublic: true,
        };

        if (destination) {
            where.destination = { contains: destination, mode: 'insensitive' };
        }

        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }

        if (country) {
            where.country = { contains: country, mode: 'insensitive' };
        }

        if (startDate && endDate) {
            where.startDate = { gte: startDate };
            where.endDate = { lte: endDate };
        }

        if (budgetMin !== undefined) {
            where.budgetMin = { gte: Number(budgetMin) };
        }

        if (budgetMax !== undefined) {
            where.budgetMax = { lte: Number(budgetMax) };
        }

        if (travelType) {
            where.travelType = travelType;
        }

        if (status) {
            where.status = status;
        }

        if (userId) {
            where.userId = userId;
        }

        const [total, travelPlans] = await Promise.all([
            prisma.travelPlan.count({ where }),
            prisma.travelPlan.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    _count: {
                        select: {
                            requests: true,
                        },
                    },
                },
            }),
        ]);

        return {
            data: travelPlans,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getTravelPlanById(id: string) {
        const travelPlan = await prisma.travelPlan.findFirst({
            where: {
                id,
                isDeleted: false,
                isPublic: true,
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        profileImage: true,
                        bio: true,
                        gender: true,
                        interests: true,

                    }
                },
                requests: {
                    where: { status: 'ACCEPTED' },
                    include: {
                        requester: {
                            select: {
                                fullName: true,
                                profileImage: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        requests: true,
                        // matches: true,
                    },
                },
            },
        });

        if (!travelPlan) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Travel plan not found');
        }

        return travelPlan;
    }

    async getMyTravelPlans(userId: string, query: any) {
        const { page = 1, limit = 10, status } = query;
        const convertedPage = Number(page);
        const convertedLimit = Number(limit);
        const skip = (convertedPage - 1) * convertedLimit;

        const where: any = {
            userId,
            isDeleted: false,
        };

        if (status) {
            where.status = status;
        }

        const [total, travelPlans] = await Promise.all([
            prisma.travelPlan.count({ where }),
            prisma.travelPlan.findMany({
                where,
                skip,
                take: convertedLimit,
                orderBy: { createdAt: 'desc' },
                include: {
                    // activities: true,
                    _count: {
                        select: {
                            requests: true,
                            // matches: true,
                        },
                    },
                },
            }),
        ]);

        return {
            data: travelPlans,
            meta: {
                page: convertedPage,
                limit: convertedLimit,
                total,
                totalPages: Math.ceil(total / convertedLimit),
            },
        };
    }

    async updateTravelPlan(id: string, userId: string, updateData: Partial<TravelPlan>) {
        const travelPlan = await prisma.travelPlan.findFirst({
            where: {
                id,
                userId,
                isDeleted: false,
            },
        });

        if (!travelPlan) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                'Travel plan not found or you do not have permission to update it'
            );
        }

        const updated = await prisma.travelPlan.update({
            where: { id },
            data: updateData,
            // include: {
            //     activities: true,
            // },
        });

        return updated;
    }

    // async deleteTravelPlan(id: string, userId: string) {
    //     const travelPlan = await prisma.travelPlan.findFirst({
    //         where: {
    //             id,
    //             userId,
    //             deletedAt: null,
    //         },
    //     });

    //     if (!travelPlan) {
    //         throw new ApiError(
    //             httpStatus.NOT_FOUND,
    //             'Travel plan not found or you do not have permission to delete it'
    //         );
    //     }

    //     // Soft delete
    //     await prisma.travelPlan.update({
    //         where: { id },
    //         data: { deletedAt: new Date() },
    //     });
    // }


}

export default new TravelPlanService();