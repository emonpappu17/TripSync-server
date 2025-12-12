/* eslint-disable no-console */
import z from "zod";
const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().default(5000),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().default("7d"),
    CORS_ORIGIN: z.string().default("*"),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
    JWT_SALT_ROUND: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    STRIPE_PRICE_MONTHLY: z.string(),
    STRIPE_PRICE_YEARLY: z.string(),
    FRONTEND_URL: z.string(),
});
const env = envSchema.safeParse(process.env);
if (!env.success) {
    console.error("❌ Invalid environment variables:", z.treeifyError(env.error));
    throw new Error("Invalid environment variables");
}
const envVars = env.data;
export default envVars;
