// import { RequestStatus } from "prisma/generated/prisma/enums";
import z from "zod";
import { RequestStatus } from "../../../../prisma/generated/prisma/enums";

export const createTravelRequestValidation = z.object({
    travelPlanId: z.string({
        error: 'Travel plan ID is required',
    }).uuid('Invalid travel plan ID'),

    message: z.string()
        .max(500, 'Message must not exceed 500 characters')
        .optional(),
})

export const updateRequestStatusValidation = z.object({
    status: z.enum(RequestStatus, {
        error: 'Status is required',
    }),
})