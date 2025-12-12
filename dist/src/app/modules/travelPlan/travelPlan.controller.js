import { StatusCodes } from "http-status-codes";
import travelPlanService from "./travelPlan.service";
import catchAsync from "src/app/utils/catchAsync";
import { fileUploader } from "src/app/helper/fileUploader";
import sendResponse from "src/app/utils/sendResponse";
import pick from "src/app/helper/pick";
// import { fileUploader } from "app/helper/fileUploader";
class TravelPlanController {
    constructor() {
        this.createTravelPlan = catchAsync(async (req, res) => {
            // if (req?.file) {
            //     req.body.image = req?.file?.path; // directly assign the URL
            // }
            if (req?.file) {
                // req.body.profileImage =  req?.file?.path;;
                const updatedImage = await fileUploader.uploadToCloudinary(req?.file);
                req.body.image = updatedImage?.secure_url;
            }
            const userId = req.user.id;
            const result = await travelPlanService.createTravelPlan(userId, req.body);
            sendResponse(res, {
                statusCode: StatusCodes.CREATED,
                success: true,
                message: 'Travel plan created successfully',
                data: result,
            });
        });
        this.getTravelPlans = catchAsync(async (req, res) => {
            const filters = pick(req.query, ["search", "destination", "country", "startDate", "endDate", "budgetMin", "budgetMax", "travelType", "status", "userId"]);
            const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
            const result = await travelPlanService.getTravelPlans(filters, options);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Travel plans retrieved successfully',
                data: result.data,
                meta: result.meta,
            });
        });
        this.getTravelPlanById = catchAsync(async (req, res) => {
            const { id } = req.params;
            const result = await travelPlanService.getTravelPlanById(id);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Travel plan retrieved successfully',
                data: result,
            });
        });
        this.getTravelPlanByUserId = catchAsync(async (req, res) => {
            const { id } = req.params;
            const result = await travelPlanService.getTravelPlanByUserId(id);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Travel plan retrieved successfully',
                data: result,
            });
        });
        this.getMyTravelPlans = catchAsync(async (req, res) => {
            const userId = req.user.id;
            const result = await travelPlanService.getMyTravelPlans(userId, req.query);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Your travel plans retrieved successfully',
                data: result.data,
                meta: result.meta,
            });
        });
        this.updateTravelPlan = catchAsync(async (req, res) => {
            // if (req?.file) {
            //     req.body.image = req?.file?.path; // directly assign the URL
            // }
            if (req?.file) {
                // req.body.profileImage =  req?.file?.path;;
                const updatedImage = await fileUploader.uploadToCloudinary(req?.file);
                req.body.image = updatedImage?.secure_url;
            }
            const { id } = req.params;
            const userId = req.user.id;
            const result = await travelPlanService.updateTravelPlan(id, userId, req.body);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Travel plan updated successfully',
                data: result,
            });
        });
        this.deleteTravelPlan = catchAsync(async (req, res) => {
            const { id } = req.params;
            const userId = req.user.id;
            await travelPlanService.deleteTravelPlan(id, userId);
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                message: 'Travel plan deleted successfully',
                data: null,
            });
        });
    }
}
export default new TravelPlanController();
