import { StatusCodes } from "http-status-codes";
import userService from "./user.service";
import catchAsync from "src/app/utils/catchAsync";
import { fileUploader } from "src/app/helper/fileUploader";
import sendResponse from "src/app/utils/sendResponse";
import pick from "src/app/helper/pick";
// import { fileUploader } from "app/helper/fileUploader";
// import pick from "app/helper/pick";
// import { fileUploader } from "app/helper/fileUploader";
class UserController {
    constructor() {
        this.updateMyProfile = catchAsync(async (req, res) => {
            // req.body = JSON.parse(req.body.data);
            const file = req.file;
            // console.log({ file });
            if (file) {
                // req.body.profileImage =  req?.file?.path;;
                const updatedImage = await fileUploader.uploadToCloudinary(file);
                req.body.profileImage = updatedImage?.secure_url;
            }
            // console.log('req.body==>', req.body);
            const userId = req.user.id;
            const result = await userService.updateProfile(userId, req.body);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'User updated successfully',
                data: result,
            });
        });
        this.getAllUsers = catchAsync(async (req, res, next) => {
            const filters = pick(req.query, ["search", "role", "isActive",]);
            const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
            const result = await userService.getAllUsers(filters, options);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Users retrieved successfully',
                data: result.data,
                meta: result.meta,
            });
        });
        this.getUserStats = catchAsync(async (req, res, next) => {
            const { id } = req.params;
            // const id = req.params.id || (req as any).user.id;
            const result = await userService.getUserStats(id);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'User statistics retrieved successfully',
                data: result,
            });
        });
        this.getUserById = catchAsync(async (req, res, next) => {
            const { id } = req.params;
            const result = await userService.getUserById(id);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'User retrieved successfully',
                data: result,
            });
        });
        this.getMyProfile = catchAsync(async (req, res, next) => {
            const userId = req.user.id;
            const result = await userService.getUserById(userId);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Profile retrieved successfully',
                data: result,
            });
        });
        this.changeUserStatus = catchAsync(async (req, res) => {
            const { id } = req.params;
            const result = await userService.changeUserStatus(id, req.body);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Status updated successfully',
                data: result,
            });
        });
        this.deleteUser = catchAsync(async (req, res, next) => {
            const { id } = req.params;
            await userService.deleteUser(id);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'User deleted successfully',
                data: null,
            });
        });
    }
}
export default new UserController();
