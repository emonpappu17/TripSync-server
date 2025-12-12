import { StatusCodes } from "http-status-codes";
import authService from "./auth.service";
import catchAsync from "src/app/utils/catchAsync";
import sendResponse from "src/app/utils/sendResponse";
import { convertToMilliseconds } from "src/app/utils/convertToMilliseconds ";
import envVars from "src/app/config/env";
// import { convertToMilliseconds } from "app/utils/convertToMilliseconds ";
// import envVars from "app/config/env";
class AuthController {
    constructor() {
        this.register = catchAsync(async (req, res, next) => {
            const result = await authService.register(req.body);
            sendResponse(res, {
                statusCode: StatusCodes.CREATED,
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        });
        this.login = catchAsync(async (req, res, next) => {
            const accessTokenMaxAge = convertToMilliseconds(envVars.JWT_EXPIRES_IN);
            const refreshTokenMaxAge = convertToMilliseconds(envVars.JWT_REFRESH_EXPIRES_IN);
            const result = await authService.login(req.body);
            const { refreshToken, accessToken } = result;
            res.cookie("accessToken", accessToken, {
                secure: true,
                httpOnly: true,
                sameSite: "none",
                maxAge: accessTokenMaxAge,
            });
            res.cookie("refreshToken", refreshToken, {
                secure: true,
                httpOnly: true,
                sameSite: "none",
                maxAge: refreshTokenMaxAge,
            });
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Login successful',
                data: result,
            });
        });
        // logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        //     // In JWT, logout is handled on client side by removing token
        //     // If using refresh tokens, you would invalidate them here
        //     sendResponse(res, {
        //         statusCode: StatusCodes.OK,
        //         success: true,
        //         message: 'Logout successful',
        //         data: null,
        //     });
        // });
    }
}
export default new AuthController();
