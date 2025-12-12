/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import travelRequestService from "./travelRequest.service";
class TravelRequestController {
    createRequest = catchAsync(async (req, res) => {
        const requesterId = req.user.id;
        // console.log('created//');
        const result = await travelRequestService.createRequest(requesterId, req.body);
        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Travel request sent successfully',
            data: result,
        });
    });
    getSentRequests = catchAsync(async (req, res) => {
        const userId = req.user.id;
        const result = await travelRequestService.getMyRequests(userId, 'sent', req.query);
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Sent requests retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
    getReceivedRequests = catchAsync(async (req, res) => {
        const userId = req.user.id;
        const result = await travelRequestService.getMyRequests(userId, 'received', req.query);
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Received requests retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
    updateRequestStatus = catchAsync(async (req, res) => {
        const { id } = req.params;
        const receiverId = req.user.id;
        const { status } = req.body;
        const result = await travelRequestService.updateRequestStatus(id, receiverId, status);
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Request status updated successfully',
            data: result,
        });
    });
    cancelRequest = catchAsync(async (req, res) => {
        const { id } = req.params;
        const requesterId = req.user.id;
        await travelRequestService.cancelRequest(id, requesterId);
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Request cancelled successfully',
            data: null,
        });
    });
}
export default new TravelRequestController();
