"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const catchAsync_1 = __importDefault(require("app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("app/utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const travelRequest_service_1 = __importDefault(require("./travelRequest.service"));
// import catchAsync from "src/app/utils/catchAsync";
// import sendResponse from "src/app/utils/sendResponse";
class TravelRequestController {
    createRequest = (0, catchAsync_1.default)(async (req, res) => {
        const requesterId = req.user.id;
        // console.log('created//');
        const result = await travelRequest_service_1.default.createRequest(requesterId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'Travel request sent successfully',
            data: result,
        });
    });
    getSentRequests = (0, catchAsync_1.default)(async (req, res) => {
        const userId = req.user.id;
        const result = await travelRequest_service_1.default.getMyRequests(userId, 'sent', req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Sent requests retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
    getReceivedRequests = (0, catchAsync_1.default)(async (req, res) => {
        const userId = req.user.id;
        const result = await travelRequest_service_1.default.getMyRequests(userId, 'received', req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Received requests retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
    updateRequestStatus = (0, catchAsync_1.default)(async (req, res) => {
        const { id } = req.params;
        const receiverId = req.user.id;
        const { status } = req.body;
        const result = await travelRequest_service_1.default.updateRequestStatus(id, receiverId, status);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Request status updated successfully',
            data: result,
        });
    });
    cancelRequest = (0, catchAsync_1.default)(async (req, res) => {
        const { id } = req.params;
        const requesterId = req.user.id;
        await travelRequest_service_1.default.cancelRequest(id, requesterId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Request cancelled successfully',
            data: null,
        });
    });
}
exports.default = new TravelRequestController();
