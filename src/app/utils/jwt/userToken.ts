// import { JwtPayload } from "jsonwebtoken";

// import { UserStatus } from "@prisma/enums";
// import { prisma } from "app/lib/prisma";

import { User } from "@prisma/client";
import envVars from "app/config/env";
// import ApiError from "app/errors/ApiError";
// import { StatusCodes } from "http-status-codes";
import { generateToken } from "./jwt";

export const generateUserTokens = (user: Partial<User>) => {
  const jwtPayload = { userId: user.id, email: user.email, role: user.role };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN
  );

  return { accessToken, refreshToken };
};

// export const createNewAccessTokenWithRefreshToken = async (
//   refreshToken: string
// ) => {
//   const verifiedRefreshToken = verifyToken(
//     refreshToken,
//     envVars.JWT_REFRESH_SECRET
//   ) as JwtPayload;
//   const isUserExist = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: verifiedRefreshToken.email,
//     },
//     include: {
//       auths: {
//         select: {
//           provider: true,
//         },
//       },
//     },
//   });
//   if (!isUserExist) {
//     throw new ApiError(StatusCodes.NOT_FOUND, "User does not exist");
//   }
//   if (
//     isUserExist.status === UserStatus.BLOCKED ||
//     isUserExist.status === UserStatus.INACTIVE
//   ) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       `User is ${isUserExist.status}`
//     );
//   }
//   if (isUserExist.isDeleted === true) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "User is deleted");
//   }

//   const jwtPayload = {
//     useId: isUserExist.id,
//     email: isUserExist.email,
//     role: isUserExist.role,
//   };
//   const accessToken = generateToken(
//     jwtPayload,
//     envVars.JWT_SECRET,
//     envVars.JWT_EXPIRES_IN
//   );
//   return accessToken;
// };
