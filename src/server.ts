/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";

import envVars from "./app/config/env";
import { prisma } from "./app/lib/prisma";

let server: Server;

const bootstrap = async () => {
  try {
    // Test Database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    server = app.listen(envVars.PORT, () => {
      console.log(`🚀 Server running on port ${envVars.PORT}`);
      console.log(`📍 Environment: ${envVars.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${envVars.PORT}/health`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

bootstrap();
// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close(() => {
      console.log("Process terminated");
      prisma.$disconnect();
    });
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received");
  if (server) {
    server.close(() => {
      console.log("Process terminated");
      prisma.$disconnect();
    });
  }
});
