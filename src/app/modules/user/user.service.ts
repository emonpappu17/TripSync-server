import { User } from "@prisma/client";
import ApiError from "app/errors/ApiError";
import { IOptions, paginationHelper } from "app/helper/paginationHelper";
import { prisma } from "app/lib/prisma";
import { StatusCodes } from "http-status-codes";

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
    });

    return updatedUser as any;
  }

  async getAllUsers(query: any, options: IOptions) {
    const {
      search,
      role,
      isActive,
    } = query;

    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options)

    // Build where clause
    const where: any = {};

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
    const total = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
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

  async getUserById(id: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        fullName: true,
        profileImage: true,
        bio: true,
        phone: true,
        currentLocation: true,
        gender: true,
        interests: true,
        visitedCountries: true,
        email: true
      }
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    return user
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
}

export default new UserService();