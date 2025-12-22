/* eslint-disable @typescript-eslint/no-unused-vars */

import { Role, User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import ApiError from "../../errors/ApiError";
import { calculatePagination, IOptions } from "../../helper/paginationHelper";


/* eslint-disable @typescript-eslint/no-explicit-any */
class UserService {
  async updateProfile(userId: string, updateData: Partial<User>): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const updatedUser = await prisma.user.update({
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

    return updatedUser as any;
  }

  async getAllUsers(query: any, options: IOptions) {
    const { search, role, isActive } = query;
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

    const where: any = {
      isDeleted: false,
      role: {
        not: Role.ADMIN,
      },
    };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { currentLocation: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = query.isActive === "true";
    }

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
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
        _count: {
          select: {
            travelPlans: {
              where: { status: "COMPLETED" },
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
      skip,
      take: 6,
      orderBy: { [sortBy]: sortOrder },
    });

    // Add avgRating per user
    const usersWithRating = users.map((user) => {
      const ratings = user.reviewsReceived.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;

      return {
        ...user,
        avgRating,
      };
    });

    return {
      data: usersWithRating,
      meta: {
        page,
        limit: 6,
        total,
        totalPages: Math.ceil(total / 6),
      },
    };
  }


  async getUserById(id: string): Promise<any> {
    const user = await prisma.user.findUnique({
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
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    // Calculate average rating
    const avgRating =
      user.reviewsReceived.length > 0
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


  async getUserStats(userId: string) {
    const stats = await prisma.user.findUnique({
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
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    // Calculate average rating
    const avgRating =
      stats.reviewsReceived.length > 0
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

  async deleteUser(id: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    // Soft delete - just deactivate
    await prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });

    // For hard delete, use:
    // await prisma.user.delete({ where: { id } });
  }

  async changeUserStatus(id: string, updateData: Partial<User>): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const updatedUser = await prisma.user.update({
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

    return updatedUser as any;
  }
}

export default new UserService();