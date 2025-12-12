/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { TravelPlan } from "@prisma/client";
import { TravelPlan, TripStatus } from "@prisma/client";
import ApiError from "app/errors/ApiError";
import { calculatePagination, IOptions } from "app/helper/paginationHelper";
import { prisma } from "app/lib/prisma";
import { StatusCodes } from "http-status-codes";

class TravelPlanService {
    async createTravelPlan(userId: string, planData: any) {
        // Convert dates
        const startDate = planData.startDate ? new Date(planData.startDate) : undefined;
        const endDate = planData.endDate ? new Date(planData.endDate) : undefined;

        // Check if user already has a plan overlapping with this date range
        const existingPlan = await prisma.travelPlan.findFirst({
            where: {
                userId,
                isDeleted: false,
                // Overlap condition:
                AND: [
                    { startDate: { lte: endDate } },   // existing plan starts before new plan ends
                    { endDate: { gte: startDate } },   // existing plan ends after new plan starts
                ],
            },
        });

        if (existingPlan) {
            throw new Error("You already have a planned trip during these dates.");
        }

        // If no conflict, create the plan
        const travelPlan = await prisma.travelPlan.create({
            data: {
                userId,
                ...planData,
                startDate,
                endDate,
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
            where.startDate = { gte: startDate ? new Date(startDate) : undefined };
            // where.startDate = { gte: startDate };
            where.endDate = { lte: endDate ? new Date(endDate) : undefined, };
            // where.endDate = { lte: endDate };
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
                        isVerified: true,
                        fullName: true,
                        profileImage: true,
                        bio: true,
                        gender: true,
                        interests: true,
                    }
                },
                requests: {
                    // where: { status: 'ACCEPTED' },
                    // include: {
                    //     requester: {
                    //         select: {
                    //             fullName: true,
                    //             profileImage: true,
                    //         },
                    //     },
                    // },

                    select: {
                        requesterId: true,
                        status: true,
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

    async getTravelPlanByUserId(id: string) {
        const travelPlan = await prisma.travelPlan.findMany({
            where: {
                userId: id,
                isDeleted: false,
                isPublic: true,
            },
            include: {
                user: {
                    select: {
                        isVerified: true,
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
                            travelMatches: true
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

        // Convert dates if provided in updateData
        const startDate = updateData.startDate ? new Date(updateData.startDate) : travelPlan.startDate;
        const endDate = updateData.endDate ? new Date(updateData.endDate) : travelPlan.endDate;

        //  Check for overlapping plans (excluding the current plan itself)
        const conflictingPlan = await prisma.travelPlan.findFirst({
            where: {
                userId,
                isDeleted: false,
                NOT: { id }, // exclude the plan being updated
                AND: [
                    { startDate: { lte: endDate } },
                    { endDate: { gte: startDate } },
                ],
            },
        });

        if (conflictingPlan) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'You already have another trip planned during these dates'
            );
        }

        const updated = await prisma.travelPlan.update({
            where: { id },
            data: {
                ...updateData,
                startDate,
                endDate,
            },
        });

        return updated;
    }


    async deleteTravelPlan(id: string, userId: string) {
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
                'Travel plan not found or you do not have permission to delete it'
            );
        }

        // Soft delete
        await prisma.travelPlan.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    async updateTravelPlanStatuses() {
        try {
            const now = new Date();
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(now.getDate() + 7);

            console.log(`[${now.toISOString()}] Running travel plan status update job...`);

            // Update PLANNING -> UPCOMING (within 7 days of start date)
            const upcomingPlans = await prisma.travelPlan.updateMany({
                where: {
                    status: TripStatus.PLANNING,
                    startDate: {
                        gte: now,
                        lte: sevenDaysFromNow,
                    },
                    isDeleted: false,
                },
                data: {
                    status: TripStatus.UPCOMING,
                },
            });

            console.log(` Updated ${upcomingPlans.count} plans to UPCOMING`);

            // Update UPCOMING/PLANNING -> ONGOING (start date has passed)
            const ongoingPlans = await prisma.travelPlan.updateMany({
                where: {
                    status: {
                        in: [TripStatus.PLANNING, TripStatus.UPCOMING],
                    },
                    startDate: {
                        lte: now,
                    },
                    endDate: {
                        gte: now,
                    },
                    isDeleted: false,
                },
                data: {
                    status: TripStatus.ONGOING,
                },
            });

            console.log(` Updated ${ongoingPlans.count} plans to ONGOING`);

            // Update ONGOING -> COMPLETED (end date has passed)
            const completedPlans = await prisma.travelPlan.updateMany({
                where: {
                    status: TripStatus.ONGOING,
                    endDate: {
                        lt: now,
                    },
                    isDeleted: false,
                },
                data: {
                    status: TripStatus.COMPLETED,
                },
            });

            console.log(` Updated ${completedPlans.count} plans to COMPLETED`);

            console.log(`[${now.toISOString()}] Travel plan status update completed successfully`);

            return {
                success: true,
                updated: {
                    upcoming: upcomingPlans.count,
                    ongoing: ongoingPlans.count,
                    completed: completedPlans.count,
                },
            };
        } catch (error) {
            console.error('❌ Error updating travel plan statuses:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
}

export default new TravelPlanService();