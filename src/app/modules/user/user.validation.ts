import z from "zod";

export const userValidation = z.object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),

    profileImage: z.string().url("Profile image must be a valid URL").optional(),

    bio: z.string().max(500, "Bio is too long").optional(),

    phone: z
        .string()
        .regex(/^\+?[0-9]{7,15}$/, "Phone number must be valid")
        .optional(),

    currentLocation: z
        .string()
        .trim()
        .min(2, "Current location is too short")
        .max(200)
        .optional(),

    gender: z.string(),

    interests: z
        .array(z.string().min(1))
        .default([]),

    visitedCountries: z
        .array(z.string().min(1))
        .default([]),
});