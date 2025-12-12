"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTravelPlanValidation = exports.createTravelPlanValidation = exports.TripStatusEnum = exports.TravelTypeEnum = void 0;
const zod_1 = require("zod");
exports.TravelTypeEnum = zod_1.z.enum(["SOLO", "FAMILY", "COUPLE", "FRIENDS"]);
exports.TripStatusEnum = zod_1.z.enum([
    "PLANNING",
    "ONGOING",
    "UPCOMING",
    "COMPLETED",
    "CANCELLED"
]);
exports.createTravelPlanValidation = zod_1.z
    .object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    description: zod_1.z.string().optional(),
    destination: zod_1.z.string().min(2),
    country: zod_1.z.string().optional(),
    startDate: zod_1.z.string().refine((val) => {
        const d = new Date(val);
        return !isNaN(d.getTime()) && d > new Date();
    }, { message: "Start date must be a valid future date" }),
    endDate: zod_1.z.string().refine((val) => {
        const d = new Date(val);
        return !isNaN(d.getTime()) && d > new Date();
    }, { message: "End date must be a valid future date" }),
    budgetMin: zod_1.z.number().positive().optional(),
    budgetMax: zod_1.z.number().positive().optional(),
    travelType: exports.TravelTypeEnum.default("SOLO"),
    maxTravelers: zod_1.z.number().optional(),
    // status: TripStatusEnum.default("PLANNING"),
    isPublic: zod_1.z.boolean().default(true),
    image: zod_1.z.string().url().optional(),
    activities: zod_1.z.array(zod_1.z.string()).optional().default([]),
    // isDeleted: z.boolean().optional()
})
    .refine((data) => {
    if (!data.startDate || !data.endDate)
        return true;
    return new Date(data.endDate) > new Date(data.startDate);
}, {
    path: ["endDate"],
    message: "End date must be after start date"
});
exports.updateTravelPlanValidation = zod_1.z
    .object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    destination: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    budgetMin: zod_1.z.number().positive().optional(),
    budgetMax: zod_1.z.number().positive().optional(),
    travelType: exports.TravelTypeEnum.optional(),
    maxTravelers: zod_1.z.number().optional(),
    status: exports.TripStatusEnum.optional(),
    isPublic: zod_1.z.boolean().optional(),
    image: zod_1.z.string().url().optional(),
    activities: zod_1.z.array(zod_1.z.string()).optional(),
    isDeleted: zod_1.z.boolean().optional()
})
    .refine((data) => {
    if (!data.startDate || !data.endDate)
        return true;
    return new Date(data.endDate) > new Date(data.startDate);
}, {
    path: ["endDate"],
    message: "End date must be after start date"
});
