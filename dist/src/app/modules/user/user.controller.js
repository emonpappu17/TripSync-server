"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const catchAsync_1 = __importDefault(require("app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("app/utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = __importDefault(require("./user.service"));
// import catchAsync from "src/app/utils/catchAsync";
// import { fileUploader } from "src/app/helper/fileUploader";
// import sendResponse from "src/app/utils/sendResponse";
// import pick from "src/app/helper/pick";
const fileUploader_1 = require("app/helper/fileUploader");
const pick_1 = __importDefault(require("app/helper/pick"));
// import { fileUploader } from "app/helper/fileUploader";
class UserController {
    updateMyProfile = (0, catchAsync_1.default)(async (req, res) => {
        // req.body = JSON.parse(req.body.data);
        const file = req.file;
        // console.log({ file });
        if (file) {
            // req.body.profileImage =  req?.file?.path;;
            const updatedImage = await fileUploader_1.fileUploader.uploadToCloudinary(file);
            req.body.profileImage = updatedImage?.secure_url;
        }
        // console.log('req.body==>', req.body);
        const userId = req.user.id;
        const result = await user_service_1.default.updateProfile(userId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'User updated successfully',
            data: result,
        });
    });
    getAllUsers = (0, catchAsync_1.default)(async (req, res, next) => {
        const filters = (0, pick_1.default)(req.query, ["search", "role", "isActive",]);
        const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
        const result = await user_service_1.default.getAllUsers(filters, options);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Users retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
    getUserStats = (0, catchAsync_1.default)(async (req, res, next) => {
        const { id } = req.params;
        // const id = req.params.id || (req as any).user.id;
        const result = await user_service_1.default.getUserStats(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'User statistics retrieved successfully',
            data: result,
        });
    });
    getUserById = (0, catchAsync_1.default)(async (req, res, next) => {
        const { id } = req.params;
        const result = await user_service_1.default.getUserById(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'User retrieved successfully',
            data: result,
        });
    });
    getMyProfile = (0, catchAsync_1.default)(async (req, res, next) => {
        const userId = req.user.id;
        const result = await user_service_1.default.getUserById(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Profile retrieved successfully',
            data: result,
        });
    });
    changeUserStatus = (0, catchAsync_1.default)(async (req, res) => {
        const { id } = req.params;
        const result = await user_service_1.default.changeUserStatus(id, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Status updated successfully',
            data: result,
        });
    });
    deleteUser = (0, catchAsync_1.default)(async (req, res, next) => {
        const { id } = req.params;
        await user_service_1.default.deleteUser(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'User deleted successfully',
            data: null,
        });
    });
}
exports.default = new UserController();
