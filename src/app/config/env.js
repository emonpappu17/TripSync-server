"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const zod_1 = __importDefault(require("zod"));
const envSchema = zod_1.default.object({
    NODE_ENV: zod_1.default
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.default.coerce.number().default(5000),
    DATABASE_URL: zod_1.default.string().min(1),
    JWT_SECRET: zod_1.default.string().min(1),
    JWT_EXPIRES_IN: zod_1.default.string().default("7d"),
    CORS_ORIGIN: zod_1.default.string().default("*"),
    JWT_REFRESH_SECRET: zod_1.default.string().min(1),
    JWT_REFRESH_EXPIRES_IN: zod_1.default.string().default("30d"),
    JWT_SALT_ROUND: zod_1.default.string(),
    CLOUDINARY_CLOUD_NAME: zod_1.default.string(),
    CLOUDINARY_API_KEY: zod_1.default.string(),
    CLOUDINARY_API_SECRET: zod_1.default.string(),
    STRIPE_SECRET_KEY: zod_1.default.string(),
    STRIPE_WEBHOOK_SECRET: zod_1.default.string(),
    STRIPE_PRICE_MONTHLY: zod_1.default.string(),
    STRIPE_PRICE_YEARLY: zod_1.default.string(),
    FRONTEND_URL: zod_1.default.string(),
});
const env = envSchema.safeParse(process.env);
if (!env.success) {
    console.error("❌ Invalid environment variables:", zod_1.default.treeifyError(env.error));
    throw new Error("Invalid environment variables");
}
const envVars = env.data;
exports.default = envVars;
