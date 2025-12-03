/* eslint-disable @typescript-eslint/no-explicit-any */
// import { TravelPlan } from "@prisma/client";
import { prisma } from "app/lib/prisma";

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

    // async getTravelPlans(query: ITravelPlanQuery) {
    //     const {
    //         page = 1,
    //         limit = 10,
    //         destination,
    //         startDate,
    //         endDate,
    //         budgetMin,
    //         budgetMax,
    //         travelType,
    //         status,
    //         userId,
    //         sortBy = 'createdAt',
    //         sortOrder = 'desc',
    //     } = query;

    //     const skip = (page - 1) * limit;

    //     const where: any = {
    //         deletedAt: null,
    //         isPublic: true,
    //     };

    //     if (destination) {
    //         where.destination = { contains: destination, mode: 'insensitive' };
    //     }

    //     if (startDate && endDate) {
    //         where.startDate = { gte: startDate };
    //         where.endDate = { lte: endDate };
    //     }

    //     if (budgetMin !== undefined) {
    //         where.budgetMin = { gte: budgetMin };
    //     }

    //     if (budgetMax !== undefined) {
    //         where.budgetMax = { lte: budgetMax };
    //     }

    //     if (travelType) {
    //         where.travelType = travelType;
    //     }

    //     if (status) {
    //         where.status = status;
    //     }

    //     if (userId) {
    //         where.userId = userId;
    //     }

    //     const [total, travelPlans] = await Promise.all([
    //         prisma.travelPlan.count({ where }),
    //         prisma.travelPlan.findMany({
    //             where,
    //             skip,
    //             take: limit,
    //             orderBy: { [sortBy]: sortOrder },
    //             include: {
    //                 activities: true,
    //                 user: {
    //                     include: {
    //                         profile: {
    //                             select: {
    //                                 fullName: true,
    //                                 profileImage: true,
    //                                 isVerified: true,
    //                             },
    //                         },
    //                     },
    //                 },
    //                 _count: {
    //                     select: {
    //                         requests: true,
    //                     },
    //                 },
    //             },
    //         }),
    //     ]);

    //     return {
    //         data: travelPlans,
    //         meta: {
    //             page,
    //             limit,
    //             total,
    //             totalPages: Math.ceil(total / limit),
    //         },
    //     };
    // }

    // async getTravelPlanById(id: string) {
    //     const travelPlan = await prisma.travelPlan.findFirst({
    //         where: {
    //             id,
    //             deletedAt: null,
    //         },
    //         include: {
    //             activities: true,
    //             user: {
    //                 include: {
    //                     profile: {
    //                         include: {
    //                             interests: true,
    //                         },
    //                     },
    //                 },
    //             },
    //             requests: {
    //                 where: { status: 'ACCEPTED' },
    //                 include: {
    //                     requester: {
    //                         include: {
    //                             profile: {
    //                                 select: {
    //                                     fullName: true,
    //                                     profileImage: true,
    //                                 },
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //             _count: {
    //                 select: {
    //                     requests: true,
    //                     matches: true,
    //                 },
    //             },
    //         },
    //     });

    //     if (!travelPlan) {
    //         throw new ApiError(httpStatus.NOT_FOUND, 'Travel plan not found');
    //     }

    //     return travelPlan;
    // }

    // async updateTravelPlan(id: string, userId: string, updateData: ITravelPlanUpdate) {
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
    //             'Travel plan not found or you do not have permission to update it'
    //         );
    //     }

    //     const updated = await prisma.travelPlan.update({
    //         where: { id },
    //         data: updateData,
    //         include: {
    //             activities: true,
    //         },
    //     });

    //     return updated;
    // }

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

    // async getMyTravelPlans(userId: string, query: any) {
    //     const { page = 1, limit = 10, status } = query;
    //     const skip = (page - 1) * limit;

    //     const where: any = {
    //         userId,
    //         deletedAt: null,
    //     };

    //     if (status) {
    //         where.status = status;
    //     }

    //     const [total, travelPlans] = await Promise.all([
    //         prisma.travelPlan.count({ where }),
    //         prisma.travelPlan.findMany({
    //             where,
    //             skip,
    //             take: limit,
    //             orderBy: { createdAt: 'desc' },
    //             include: {
    //                 activities: true,
    //                 _count: {
    //                     select: {
    //                         requests: true,
    //                         matches: true,
    //                     },
    //                 },
    //             },
    //         }),
    //     ]);

    //     return {
    //         data: travelPlans,
    //         meta: {
    //             page,
    //             limit,
    //             total,
    //             totalPages: Math.ceil(total / limit),
    //         },
    //     };
    // }
}

export default new TravelPlanService();