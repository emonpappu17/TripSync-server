"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./app/config/env"));
const prisma_1 = require("./app/lib/prisma");
const seedAdmin_1 = require("./app/utils/seedAdmin");
// import { seedAdmin } from "app/utils/seedAdmin";
let server;
const bootstrap = async () => {
    try {
        // Test Database connection
        await prisma_1.prisma.$connect();
        console.log("✅ Database connected successfully");
        server = app_1.default.listen(env_1.default.PORT, () => {
            console.log(`🚀 Server running on port ${env_1.default.PORT}`);
            console.log(`📍 Environment: ${env_1.default.NODE_ENV}`);
            console.log(`🔗 Health check: http://localhost:${env_1.default.PORT}/health`);
        });
    }
    catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};
bootstrap();
(0, seedAdmin_1.seedAdmin)();
// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received");
    if (server) {
        server.close(() => {
            console.log("Process terminated");
            prisma_1.prisma.$disconnect();
        });
    }
});
process.on("SIGINT", () => {
    console.log("SIGINT received");
    if (server) {
        server.close(() => {
            console.log("Process terminated");
            prisma_1.prisma.$disconnect();
        });
    }
});
