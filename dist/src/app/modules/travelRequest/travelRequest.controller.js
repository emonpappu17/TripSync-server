import { StatusCodes } from "http-status-codes";
import travelRequestService from "./travelRequest.service";
import catchAsync from "src/app/utils/catchAsync";
import sendResponse from "src/app/utils/sendResponse";
class TravelRequestController {
    constructor() {
        this.createRequest = catchAsync(async (req, res) => {
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
        this.getSentRequests = catchAsync(async (req, res) => {
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
        this.getReceivedRequests = catchAsync(async (req, res) => {
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
        this.updateRequestStatus = catchAsync(async (req, res) => {
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
        this.cancelRequest = catchAsync(async (req, res) => {
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
}
export default new TravelRequestController();
