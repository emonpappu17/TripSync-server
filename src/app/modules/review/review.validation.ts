import { z } from "zod";

export const createReviewValidation = z.object({
    fromReviewerId: z
        .string({ error: "fromReviewerId is required" })
        .uuid("Invalid UUID format"),

    toReviewerId: z
        .string({ error: "toReviewerId is required" })
        .uuid("Invalid UUID format"),

    tourPlanId: z
        .string({ error: "tourPlanId is required" })
        .uuid("Invalid UUID format"),

    rating: z
        .number({
            error: "Rating is required",
            // : "Rating must be a number",
        })
        .int("Rating must be an integer")
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5"),

    comment: z
        .string()
        .max(1000, "Comment too long")
        .optional()
        .nullable(),

    isPublic: z
        .boolean()
        .default(true),
});

export const updateReviewValidation = z.object({
    rating: z
        .number({
            error: "Rating must be a number",
        })
        .int("Rating must be an integer")
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5")
        .optional(),

    comment: z
        .string()
        .max(1000, "Comment too long")
        .optional()
        .nullable(),

    isPublic: z.boolean().optional(),
});
