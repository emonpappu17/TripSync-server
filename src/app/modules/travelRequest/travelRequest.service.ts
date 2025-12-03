/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiError from "app/errors/ApiError";
import { prisma } from "app/lib/prisma";
import { StatusCodes } from "http-status-codes";

class TravelRequestService {
    async createRequest(requesterId: string, requestData: any) {
        // Get travel plan
        const travelPlan = await prisma.travelPlan.findFirst({
            where: {
                id: requestData.travelPlanId,
                isDeleted: false,
            },
        });

        if (!travelPlan) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Travel plan not found');
        }

        // Cannot request to join own plan
        if (travelPlan.userId === requesterId) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Cannot request to join your own travel plan'
            );
        }

        // Check if request already exists
        const existingRequest = await prisma.travelRequest.findUnique({
            where: {
                travelPlanId_requesterId: {
                    travelPlanId: requestData.travelPlanId,
                    requesterId,
                },
            },
        });

        if (existingRequest) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'You have already sent a request for this travel plan'
            );
        }

        // Create request in transaction
        const request = await prisma.$transaction(async (tx) => {
            const newRequest = await tx.travelRequest.create({
                data: {
                    travelPlanId: requestData.travelPlanId,
                    requesterId,
                    receiverId: travelPlan.userId,
                    message: requestData.message,
                },
                include: {
                    requester: {
                        select: {
                            fullName: true,
                            profileImage: true,
                        },
                        // include: {
                        //     profile: {
                        //         select: {
                        //             fullName: true,
                        //             profileImage: true,
                        //         },
                        //     },
                        // },
                    },
                    travelPlan: {
                        select: {
                            title: true,
                            destination: true,
                        },
                    },
                },
            });

            // Create notification
            // await tx.notification.create({
            //     data: {
            //         userId: travelPlan.userId,
            //         title: 'New Travel Request',
            //         message: `${newRequest.requester.profile?.fullName} wants to join your trip to ${newRequest.travelPlan.destination}`,
            //         type: 'travel_request',
            //         link: `/travel-plans/${requestData.travelPlanId}`,
            //     },
            // });

            return newRequest;
        });

        return request;
    }

    async getMyRequests(userId: string, type: 'sent' | 'received', query: any) {
        const { page = 1, limit = 10, status } = query;
        const convertedPage = Number(page);
        const convertedLimit = Number(limit);

        const skip = (convertedPage - 1) * convertedLimit;

        const where: any = {
            ...(type === 'sent' ? { requesterId: userId } : { receiverId: userId }),
        };

        if (status) {
            where.status = status;
        }

        const [total, requests] = await Promise.all([
            prisma.travelRequest.count({ where }),
            prisma.travelRequest.findMany({
                where,
                skip,
                take: convertedLimit,
                orderBy: { createdAt: 'desc' },
                include: {
                    requester: {
                        select: {
                            fullName: true,
                            profileImage: true,
                            isVerified: true,
                        },
                        // include: {
                        //     profile: {
                        //         select: {
                        //             fullName: true,
                        //             profileImage: true,
                        //             isVerified: true,
                        //         },
                        //     },
                        // },
                    },
                    receiver: {
                        select: {
                            fullName: true,
                            profileImage: true,
                        },
                        // include: {
                        //     profile: {
                        //         select: {
                        //             fullName: true,
                        //             profileImage: true,
                        //         },
                        //     },
                        // },
                    },
                    travelPlan: {
                        select: {
                            id: true,
                            title: true,
                            destination: true,
                            startDate: true,
                            endDate: true,
                        },
                    },
                },
            }),
        ]);

        return {
            data: requests,
            meta: {
                page: convertedPage,
                limit: convertedLimit,
                total,
                totalPages: Math.ceil(total / convertedLimit),
            },
        };
    }

    // async updateRequestStatus(
    //     requestId: string,
    //     receiverId: string,
    //     status: RequestStatus
    // ) {
    //     const request = await prisma.travelRequest.findFirst({
    //         where: {
    //             id: requestId,
    //             receiverId,
    //         },
    //         include: {
    //             travelPlan: true,
    //         },
    //     });

    //     if (!request) {
    //         throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
    //     }

    //     if (request.status !== RequestStatus.PENDING) {
    //         throw new ApiError(
    //             httpStatus.BAD_REQUEST,
    //             'This request has already been processed'
    //         );
    //     }

    //     const updated = await prisma.$transaction(async (tx) => {
    //         const updatedRequest = await tx.travelRequest.update({
    //             where: { id: requestId },
    //             data: {
    //                 status,
    //                 respondedAt: new Date(),
    //             },
    //         });

    //         // If accepted, create travel match
    //         if (status === RequestStatus.ACCEPTED) {
    //             await tx.travelMatch.create({
    //                 data: {
    //                     travelPlanId: request.travelPlanId,
    //                     user1Id: request.receiverId,
    //                     user2Id: request.requesterId,
    //                     isActive: true,
    //                 },
    //             });
    //         }

    //         // Create notification
    //         await tx.notification.create({
    //             data: {
    //                 userId: request.requesterId,
    //                 title: `Request ${status.toLowerCase()}`,
    //                 message: `Your request to join "${request.travelPlan.title}" has been ${status.toLowerCase()}`,
    //                 type: 'request_update',
    //                 link: `/travel-plans/${request.travelPlanId}`,
    //             },
    //         });

    //         return updatedRequest;
    //     });

    //     return updated;
    // }

    // async cancelRequest(requestId: string, requesterId: string) {
    //     const request = await prisma.travelRequest.findFirst({
    //         where: {
    //             id: requestId,
    //             requesterId,
    //             status: RequestStatus.PENDING,
    //         },
    //     });

    //     if (!request) {
    //         throw new ApiError(httpStatus.NOT_FOUND, 'Request not found or cannot be cancelled');
    //     }

    //     await prisma.travelRequest.update({
    //         where: { id: requestId },
    //         data: { status: RequestStatus.CANCELLED },
    //     });
    // }
}

export default new TravelRequestService();