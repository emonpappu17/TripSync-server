"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewValidation = exports.createReviewValidation = void 0;
const zod_1 = require("zod");
exports.createReviewValidation = zod_1.z.object({
    // fromReviewerId: z
    //     .string({ error: "fromReviewerId is required" })
    //     .uuid("Invalid UUID format"),
    toReviewerId: zod_1.z
        .string({ error: "toReviewerId is required" })
        .uuid("Invalid UUID format"),
    tourPlanId: zod_1.z
        .string({ error: "tourPlanId is required" })
        .uuid("Invalid UUID format"),
    rating: zod_1.z
        .number({
        error: "Rating is required",
        // : "Rating must be a number",
    })
        .int("Rating must be an integer")
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5"),
    comment: zod_1.z
        .string()
        .max(1000, "Comment too long")
        .optional()
        .nullable(),
    isPublic: zod_1.z
        .boolean()
        .default(true),
});
exports.updateReviewValidation = zod_1.z.object({
    rating: zod_1.z
        .number({
        error: "Rating must be a number",
    })
        .int("Rating must be an integer")
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5")
        .optional(),
    comment: zod_1.z
        .string()
        .max(1000, "Comment too long")
        .optional()
        .nullable(),
    isPublic: zod_1.z.boolean().optional(),
});
