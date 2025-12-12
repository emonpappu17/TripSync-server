"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const cors_1 = __importDefault(require("cors"));
// import express, { Application, Request, Response } from "express";
// import rateLimit from "express-rate-limit";
// import helmet from "helmet";
// import { StatusCodes } from "http-status-codes";
// import envVars from "./app/config/env";
// import globalErrorHandler from "./app/errors/globalErrorHandler";
// import NotFoundError from "./app/errors/notFoundError";
// import { router } from "./app/routes";
// import cookieParser from "cookie-parser";
const node_cron_1 = __importDefault(require("node-cron"));
// import travelPlanService from "app/modules/travelPlan/travelPlan.service";
// import paymentController from "app/modules/payment/payment.controller";
// import paymentController from "app/modules/payment/payment.controller";
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const payment_controller_1 = __importDefault(require("./app/modules/payment/payment.controller"));
const env_1 = __importDefault(require("./app/config/env"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const travelPlan_service_1 = __importDefault(require("./app/modules/travelPlan/travelPlan.service"));
const http_status_codes_1 = require("http-status-codes");
const routes_1 = require("./app/routes");
const notFoundError_1 = __importDefault(require("./app/errors/notFoundError"));
const globalErrorHandler_1 = __importDefault(require("./app/errors/globalErrorHandler"));
// import envVars from "app/config/env";
// import cookieParser from "cookie-parser";
// import travelPlanService from "app/modules/travelPlan/travelPlan.service";
// import { StatusCodes } from "http-status-codes";
// import { router } from "app/routes";
// import NotFoundError from "app/errors/notFoundError";
// import globalErrorHandler from "app/errors/globalErrorHandler";
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
app.post("/webhook", express_1.default.raw({ type: "application/json" }), payment_controller_1.default.stripeWebhook);
// CORS
app.use((0, cors_1.default)({
    origin: env_1.default.CORS_ORIGIN,
    credentials: true,
}));
// Body parser
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// CRON JOB SETUP
const CRON_SCHEDULE = env_1.default.NODE_ENV === 'production'
    ? '0 0 * * *' // Production: Daily at midnight
    : '*/30 * * * *'; // Development: Every 30 minutes for testing
node_cron_1.default.schedule(CRON_SCHEDULE, async () => {
    try {
        console.log("Node cron called at:", new Date());
        await travelPlan_service_1.default.updateTravelPlanStatuses();
    }
    catch (error) {
        console.error(`
💥 ===== CRON JOB EXCEPTION =====
Error: ${error instanceof Error ? error.message : 'Unknown error'}
Stack: ${error instanceof Error ? error.stack : 'N/A'}
=================================
    `);
    }
});
// Health check route
app.get("/health", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: "Server is running smoothly",
        timestamp: new Date().toISOString(),
    });
});
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Backed boilerplate server running",
        port: env_1.default.PORT,
        timestamp: new Date().toISOString(),
    });
});
// Application routes
app.use("/api/v1", routes_1.router);
// Handle 404 routes
app.all(/.*/, (req) => {
    throw new notFoundError_1.default(req.originalUrl);
});
// Global error handler
app.use(globalErrorHandler_1.default);
exports.default = app;
