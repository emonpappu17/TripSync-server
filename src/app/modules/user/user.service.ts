import { User } from "@prisma/client";
import ApiError from "app/errors/ApiError";
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