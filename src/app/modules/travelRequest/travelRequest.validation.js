import { RequestStatus } from "@prisma/enums";
import z from "zod";
export const createTravelRequestValidation = z.object({
    travelPlanId: z.string({
        error: 'Travel plan ID is required',
    }).uuid('Invalid travel plan ID'),
    message: z.string()
        .max(500, 'Message must not exceed 500 characters')
        .optional(),
});
export const updateRequestStatusValidation = z.object({
    status: z.enum(RequestStatus, {
        error: 'Status is required',
    }),
});
