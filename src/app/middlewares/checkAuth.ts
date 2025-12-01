import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env";
import ApiError from "../errors/ApiError";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../utils/jwt/jwt";

export const CheckAuth =
  (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        if (!accessToken) {
          throw new ApiError(StatusCodes.FORBIDDEN, "No access token received");
        }
        const verifiedToken = verifyToken(
          accessToken,
          envVars.JWT_SECRET
        ) as JwtPayload;

        const isUserExist = await prisma.user.findUniqueOrThrow({
          where: {
            email: verifiedToken.email,
          },
        });

        if (!isUserExist) {
          throw new ApiError(StatusCodes.NOT_FOUND, "User does not exist");
        }
        if (
          !isUserExist.isActive
          // isUserExist.status === UserStatus.INACTIVE
        ) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `User is not active`
          );
        }
        if (isUserExist.isDeleted) {
          throw new ApiError(StatusCodes.BAD_REQUEST, "User is deleted");
        }
        if (!authRoles.includes(verifiedToken.role)) {
          throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You are not permitted to view this route !!!"
          );
        }
        req.user = verifiedToken;
      } catch (err) {
        next(err);
      }
    };
