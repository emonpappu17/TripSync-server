import { z } from "zod";

// Prisma enums must be manually recreated for Zod
export const TravelTypeEnum = z.enum(["SOLO", "FAMILY", "COUPLE", "FRIENDS"]);
export const TripStatusEnum = z.enum(["PLANNING", "ONGOING", "UPCOMING", "COMPLETED", "CANCELLED"]);

// Decimal validation → accept string or number
// const decimalSchema = z.union([
//     z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid decimal format"),
//     z.number()
// ]);

export const createTravelPlanZodSchema = z.object({
    // userId: z.string(),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    destination: z.string().min(2),
    country: z.string().optional(),

    startDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid start date"),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid end date"),

    // budgetMin: decimalSchema.optional(),
    // budgetMax: decimalSchema.optional(),

    budgetMin: z.number().positive().optional(),
    budgetMax: z.number().positive().optional(),

    travelType: TravelTypeEnum.default("SOLO"),
    maxTravelers: z.number().optional(),

    status: TripStatusEnum.default("PLANNING"),
    isPublic: z.boolean().default(true),

    image: z.string().url().optional(),
    activities: z.array(z.string()).optional().default([]),

    isDeleted: z.boolean().optional()
})


export const updateTravelPlanZodSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    destination: z.string().optional(),
    country: z.string().optional(),

    startDate: z.string().optional(),
    endDate: z.string().optional(),

    // budgetMin: decimalSchema.optional(),
    // budgetMax: decimalSchema.optional(),

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