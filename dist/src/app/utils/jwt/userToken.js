"use strict";
// import { JwtPayload } from "jsonwebtoken";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserTokens = void 0;
const env_1 = __importDefault(require("app/config/env"));
// import ApiError from "app/errors/ApiError";
// import { StatusCodes } from "http-status-codes";
const jwt_1 = require("./jwt");
// import envVars from "src/app/config/env";
const generateUserTokens = (user) => {
    const jwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.default.JWT_SECRET, env_1.default.JWT_EXPIRES_IN);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_1.default.JWT_REFRESH_SECRET, env_1.default.JWT_REFRESH_EXPIRES_IN);
    return { accessToken, refreshToken };
};
exports.generateUserTokens = generateUserTokens;
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
