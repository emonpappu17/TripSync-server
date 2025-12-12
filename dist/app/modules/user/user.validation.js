"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userValidation = zod_1.default.object({
    fullName: zod_1.default.string().trim().min(2, "Full name must be at least 2 characters").optional(),
    profileImage: zod_1.default.string().url("Profile image must be a valid URL").optional(),
    bio: zod_1.default.string().max(500, "Bio is too long").optional(),
    role: zod_1.default.string().optional(),
    isActive: zod_1.default.boolean().optional(),
    isVerified: zod_1.default.boolean().optional(),
    phone: zod_1.default
        .string()
        .regex(/^\+?[0-9]{7,15}$/, "Phone number must be valid")
        .optional(),
    currentLocation: zod_1.default
        .string()
        .trim()
        .min(2, "Current location is too short")
        .max(200)
        .optional(),
    gender: zod_1.default.string().optional(),
    interests: zod_1.default
        .array(zod_1.default.string().min(1))
        .default([]).optional(),
    visitedCountries: zod_1.default
        .array(zod_1.default.string().min(1))
        .default([]).optional(),
});
