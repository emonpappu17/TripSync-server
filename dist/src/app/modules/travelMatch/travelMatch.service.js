// app/modules/travelMatch/travelMatch.service.ts
import { prisma } from "app/lib/prisma";
import ApiError from "app/errors/ApiError";
import { StatusCodes } from "http-status-codes";
// import ApiError from "src/app/errors/ApiError";
// import { calculatePagination, IOptions } from "src/app/helper/paginationHelper";
// import { prisma } from "src/app/lib/prisma";
import { calculatePagination } from "app/helper/paginationHelper";
class TravelMatchService {
    /**
     * Get all matches for a user (as either user1 or user2)
     */
    async getMyMatches(userId, options) {
        const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
        const where = {
            OR: [
                { user1Id: userId },
                { user2Id: userId }
            ],
            isActive: true,
        };
        const [total, matches] = await Promise.all([
            prisma.travelMatch.count({ where }),
            prisma.travelMatch.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    travelPlan: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    profileImage: true,
                                    bio: true,
                                    gender: true,
                                    interests: true,
                                }
                            }
                        }
                    },
                },
            }),
        ]);
        // Enhance data with buddy information
        const enhancedMatches = await Promise.all(matches.map(async (match) => {
            // Determine who the buddy is (the other user)
            const buddyId = match.user1Id === userId ? match.user2Id : match.user1Id;
            // Fetch buddy details
            const buddy = await prisma.user.findUnique({
                where: { id: buddyId },
                select: {
                    id: true,
                    fullName: true,
                    profileImage: true,
                    bio: true,
                    gender: true,
                    interests: true,
                    email: true,
                }
            });
            return {
                ...match,
                buddy,
                isPlanOwner: match.travelPlan.userId === userId,
            };
        }));
        return {
            data: enhancedMatches,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get all matches for a specific travel plan
     */
    async getMatchesByPlanId(planId, userId) {
        // Verify user has access to this plan (must be plan owner or a matched user)
        const plan = await prisma.travelPlan.findFirst({
            where: {
                id: planId,
                isDeleted: false,
            },
        });
        if (!plan) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Travel plan not found');
        }
        // Check if user is plan owner or has a match for this plan
        const hasAccess = plan.userId === userId || await prisma.travelMatch.findFirst({
            where: {
                travelPlanId: planId,
                OR: [
                    { user1Id: userId },
                    { user2Id: userId }
                ],
                isActive: true,
            }
        });
        if (!hasAccess) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have access to view these matches');
        }
        const matches = await prisma.travelMatch.findMany({
            where: {
                travelPlanId: planId,
                isActive: true,
            },
            include: {
                travelPlan: {
                    select: {
                        title: true,
                        destination: true,
                        startDate: true,
                        endDate: true,
                    }
                },
            },
        });
        // Fetch user details for all matched users
        const enhancedMatches = await Promise.all(matches.map(async (match) => {
            const [user1, user2] = await Promise.all([
                prisma.user.findUnique({
                    where: { id: match.user1Id },
                    select: {
                        id: true,
                        fullName: true,
                        profileImage: true,
                        isVerified: true,
                        bio: true,
                        gender: true,
                        interests: true,
                    }
                }),
                prisma.user.findUnique({
                    where: { id: match.user2Id },
                    select: {
                        id: true,
                        fullName: true,
                        profileImage: true,
                        bio: true,
                        gender: true,
                        interests: true,
                    }
                })
            ]);
            return {
                ...match,
                user1,
                user2,
            };
        }));
        return enhancedMatches;
    }
    /**
     * Get a specific match by ID
     */
    async getMatchById(matchId, userId) {
        const match = await prisma.travelMatch.findUnique({
            where: { id: matchId },
            include: {
                travelPlan: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                profileImage: true,
                                bio: true,
                            }
                        }
                    }
                },
            },
        });
        if (!match) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Match not found');
        }
        // Verify user is part of this match
        if (match.user1Id !== userId && match.user2Id !== userId) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have access to this match');
        }
        // Get buddy information
        const buddyId = match.user1Id === userId ? match.user2Id : match.user1Id;
        const buddy = await prisma.user.findUnique({
            where: { id: buddyId },
            select: {
                id: true,
                fullName: true,
                profileImage: true,
                bio: true,
                gender: true,
                interests: true,
                email: true,
            }
        });
        return {
            ...match,
            buddy,
            isPlanOwner: match.travelPlan.userId === userId,
        };
    }
    /**
     * Deactivate a match (soft delete)
     */
    async deactivateMatch(matchId, userId) {
        const match = await prisma.travelMatch.findUnique({
            where: { id: matchId },
        });
        if (!match) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Match not found');
        }
        // Verify user is part of this match
        if (match.user1Id !== userId && match.user2Id !== userId) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to deactivate this match');
        }
        await prisma.travelMatch.update({
            where: { id: matchId },
            data: { isActive: false },
        });
        return { message: 'Match deactivated successfully' };
    }
    /**
     * Check if two users are matched for a specific plan
     */
    async checkMatch(planId, userId, otherUserId) {
        const match = await prisma.travelMatch.findFirst({
            where: {
                travelPlanId: planId,
                OR: [
                    { user1Id: userId, user2Id: otherUserId },
                    { user1Id: otherUserId, user2Id: userId }
                ],
                isActive: true,
            }
        });
        return {
            isMatched: !!match,
            match: match || null,
        };
    }
    /**
     * Get match statistics for a user
     */
    async getMatchStatistics(userId) {
        const [totalMatches, activeMatches, matchesByPlan] = await Promise.all([
            // Total matches
            prisma.travelMatch.count({
                where: {
                    OR: [
                        { user1Id: userId },
                        { user2Id: userId }
                    ],
                }
            }),
            // Active matches
            prisma.travelMatch.count({
                where: {
                    OR: [
                        { user1Id: userId },
                        { user2Id: userId }
                    ],
                    isActive: true,
                }
            }),
            // Matches grouped by plan
            prisma.travelMatch.groupBy({
                by: ['travelPlanId'],
                where: {
                    OR: [
                        { user1Id: userId },
                        { user2Id: userId }
                    ],
                    isActive: true,
                },
                _count: true,
            })
        ]);
        return {
            totalMatches,
            activeMatches,
            inactiveMatches: totalMatches - activeMatches,
            plansWithMatches: matchesByPlan.length,
        };
    }
}
export default new TravelMatchService();
