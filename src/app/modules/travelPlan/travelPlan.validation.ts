import { z } from "zod";

export const TravelTypeEnum = z.enum(["SOLO", "FAMILY", "COUPLE", "FRIENDS"]);
export const TripStatusEnum = z.enum([
    "PLANNING",
    "ONGOING",
    "UPCOMING",
    "COMPLETED",
    "CANCELLED"
]);

export const createTravelPlanValidation = z
    .object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        description: z.string().optional(),
        destination: z.string().min(2),
        country: z.string().optional(),

        startDate: z.string().refine(
            (val) => {
                const d = new Date(val);
                return !isNaN(d.getTime()) && d > new Date();
            },
            { message: "Start date must be a valid future date" }
        ),

        endDate: z.string().refine(
            (val) => {
                const d = new Date(val);
                return !isNaN(d.getTime()) && d > new Date();
            },
            { message: "End date must be a valid future date" }
        ),

        budgetMin: z.number().positive().optional(),
        budgetMax: z.number().positive().optional(),

        travelType: TravelTypeEnum.default("SOLO"),
        maxTravelers: z.number().optional(),

        // status: TripStatusEnum.default("PLANNING"),
        isPublic: z.boolean().default(true),

        image: z.string().url().optional(),
        activities: z.array(z.string()).optional().default([]),

        // isDeleted: z.boolean().optional()
    })
    .refine(
        (data) => {
            if (!data.startDate || !data.endDate) return true;
            return new Date(data.endDate) > new Date(data.startDate);
        },
        {
            path: ["endDate"],
            message: "End date must be after start date"
        }
    );

export const updateTravelPlanZodSchema = z
    .object({
        title: z.string().optional(),
        description: z.string().optional(),
        destination: z.string().optional(),
        country: z.string().optional(),

        startDate: z.string().optional(),
        endDate: z.string().optional(),

        budgetMin: z.number().positive().optional(),
        budgetMax: z.number().positive().optional(),

        travelType: TravelTypeEnum.optional(),
        maxTravelers: z.number().optional(),

        status: TripStatusEnum.optional(),
        isPublic: z.boolean().optional(),

        image: z.string().url().optional(),
        activities: z.array(z.string()).optional(),

        isDeleted: z.boolean().optional()
    })
    .refine(
        (data) => {
            if (!data.startDate || !data.endDate) return true;
            return new Date(data.endDate) > new Date(data.startDate);
        },
        {
            path: ["endDate"],
            message: "End date must be after start date"
        }
    );
