"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const fileUploader_1 = require("app/helper/fileUploader");
const pick_1 = __importDefault(require("app/helper/pick"));
const catchAsync_1 = __importDefault(require("app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("app/utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const travelPlan_service_1 = __importDefault(require("./travelPlan.service"));
// import catchAsync from "src/app/utils/catchAsync";
// import { fileUploader } from "src/app/helper/fileUploader";
// import sendResponse from "src/app/utils/sendResponse";
// import pick from "src/app/helper/pick";
// import { fileUploader } from "app/helper/fileUploader";
class TravelPlanController {
    createTravelPlan = (0, catchAsync_1.default)(async (req, res) => {
        // if (req?.file) {
        //     req.body.image = req?.file?.path; // directly assign the URL
        // }
        if (req?.file) {
            // req.body.profileImage =  req?.file?.path;;
            const updatedImage = await fileUploader_1.fileUploader.uploadToCloudinary(req?.file);
            req.body.image = updatedImage?.secure_url;
        }
        const userId = req.user.id;
        const result = await travelPlan_service_1.default.createTravelPlan(userId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'Travel plan created successfully',
            data: result,
        });
    });
    getTravelPlans = (0, catchAsync_1.default)(async (req, res) => {
        const filters = (0, pick_1.default)(req.query, ["search", "destination", "country", "startDate", "endDate", "budgetMin", "budgetMax", "travelType", "status", "userId"]);
        const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
        const result = await travelPlan_service_1.default.getTravelPlans(filters, options);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Travel plans retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
    getTravelPlanById = (0, catchAsync_1.default)(async (req, res) => {
        const { id } = req.params;
        const result = await travelPlan_service_1.default.getTravelPlanById(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Travel plan retrieved successfully',
            data: result,
        });
    });
    getTravelPlanByUserId = (0, catchAsync_1.default)(async (req, res) => {
        const { id } = req.params;
        const result = await travelPlan_service_1.default.getTravelPlanByUserId(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Travel plan retrieved successfully',
            data: result,
        });
    });
    getMyTravelPlans = (0, catchAsync_1.default)(async (req, res) => {
        const userId = req.user.id;
        const result = await travelPlan_service_1.default.getMyTravelPlans(userId, req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Your travel plans retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
    updateTravelPlan = (0, catchAsync_1.default)(async (req, res) => {
        // if (req?.file) {
        //     req.body.image = req?.file?.path; // directly assign the URL
        // }
        if (req?.file) {
            // req.body.profileImage =  req?.file?.path;;
            const updatedImage = await fileUploader_1.fileUploader.uploadToCloudinary(req?.file);
            req.body.image = updatedImage?.secure_url;
        }
        const { id } = req.params;
        const userId = req.user.id;
        const result = await travelPlan_service_1.default.updateTravelPlan(id, userId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Travel plan updated successfully',
            data: result,
        });
    });
    deleteTravelPlan = (0, catchAsync_1.default)(async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
        await travelPlan_service_1.default.deleteTravelPlan(id, userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Travel plan deleted successfully',
            data: null,
        });
    });
}
exports.default = new TravelPlanController();
