"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const travelMatch_service_1 = __importDefault(require("./travelMatch.service"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../helper/pick"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// import catchAsync from "src/app/utils/catchAsync";
// import pick from "src/app/helper/pick";
// import sendResponse from "src/app/utils/sendResponse";
// import pick from "app/helper/pick";
// import catchAsync from ""
class TravelMatchController {
    getMyMatches = (0, catchAsync_1.default)(async (req, res) => {
        const userId = req.user.id;
        const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
        const result = await travelMatch_service_1.default.getMyMatches(userId, options);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Your travel matches retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
    getMatchesByPlanId = (0, catchAsync_1.default)(async (req, res) => {
        const { planId } = req.params;
        const userId = req.user.id;
        const result = await travelMatch_service_1.default.getMatchesByPlanId(planId, userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Travel plan matches retrieved successfully',
            data: result,
        });
    });
    getMatchById = (0, catchAsync_1.default)(async (req, res) => {
        const { matchId } = req.params;
        const userId = req.user.id;
        const result = await travelMatch_service_1.default.getMatchById(matchId, userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Match details retrieved successfully',
            data: result,
        });
    });
    deactivateMatch = (0, catchAsync_1.default)(async (req, res) => {
        const { matchId } = req.params;
        const userId = req.user.id;
        const result = await travelMatch_service_1.default.deactivateMatch(matchId, userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: result.message,
            data: null,
        });
    });
    checkMatch = (0, catchAsync_1.default)(async (req, res) => {
        const { planId, otherUserId } = req.params;
        const userId = req.user.id;
        const result = await travelMatch_service_1.default.checkMatch(planId, userId, otherUserId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Match status retrieved',
            data: result,
        });
    });
    getMatchStatistics = (0, catchAsync_1.default)(async (req, res) => {
        const userId = req.user.id;
        const result = await travelMatch_service_1.default.getMatchStatistics(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Match statistics retrieved successfully',
            data: result,
        });
    });
}
exports.default = new TravelMatchController();
