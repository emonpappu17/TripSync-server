"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const admin_service_1 = __importDefault(require("./admin.service"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const pick_1 = __importDefault(require("../../helper/pick"));
class AdminController {
    getDashboardStats = (0, catchAsync_1.default)(async (req, res) => {
        const result = await admin_service_1.default.getDashboardStats();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Dashboard statistics retrieved successfully',
            data: result,
        });
    });
    getAnalytics = (0, catchAsync_1.default)(async (req, res) => {
        const filters = (0, pick_1.default)(req.query, ["startDate", "endDate", "type", "groupBy"]);
        const result = await admin_service_1.default.getAnalytics(filters);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Analytics data retrieved successfully',
            data: result,
        });
    });
    getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
        const filters = (0, pick_1.default)(req.query, ["search", "role", "isActive", "isVerified"]);
        const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
        const result = await admin_service_1.default.getAllUsers(filters, options);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Users retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
    manageUser = (0, catchAsync_1.default)(async (req, res) => {
        const adminId = req.user.id;
        const result = await admin_service_1.default.manageUser(adminId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'User action completed successfully',
            data: result,
        });
    });
    // moderateContent = catchAsync(async (req: Request, res: Response) => {
    //     const adminId = (req as any).user.id;
    //     const result = await adminService.moderateContent(adminId, req.body);
    //     sendResponse(res, {
    //         statusCode: statuscodes.OK,
    //         success: true,
    //         message: 'Content moderation completed successfully',
    //         data: result,
    //     });
    // });
    // getActivityLogs = catchAsync(async (req: Request, res: Response) => {
    //     const result = await adminService.getActivityLogs(req.query);
    //     sendResponse(res, {
    //         statusCode: statuscodes.OK,
    //         success: true,
    //         message: 'Activity logs retrieved successfully',
    //         data: result.data,
    //         meta: result.meta,
    //     });
    // });
    getAllTravelPlans = (0, catchAsync_1.default)(async (req, res) => {
        const filters = (0, pick_1.default)(req.query, ["search", "status"]);
        const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
        const result = await admin_service_1.default.getAllTravelPlans(filters, options);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Travel plans retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
}
exports.default = new AdminController();
