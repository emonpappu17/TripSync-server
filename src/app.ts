import cors from "cors";
import express, { Application, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import envVars from "./app/config/env";
import globalErrorHandler from "./app/errors/globalErrorHandler";
import NotFoundError from "./app/errors/notFoundError";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import cron from 'node-cron';
import travelPlanService from "app/modules/travelPlan/travelPlan.service";
import paymentController from "app/modules/payment/payment.controller";

const app: Application = express();
// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
)

// CORS
app.use(
  cors({
    origin: envVars.CORS_ORIGIN,
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// startTestCronJob() {
//   cron.schedule('* * * * *', async () => {
//     await this.updateTravelPlanStatuses();
//   }, {
//     scheduled: true,
//     timezone: "UTC"
//   });

//   console.log('🚀 Travel plan status cron job started (runs every minute - TEST MODE)');
// }


// cron.schedule('* * * * *', () => {
//   try {
//     console.log("Node cron called at:", new Date());
//     travelPlanService.updateTravelPlanStatuses()
//   } catch (error) {
//     console.log(error);
//   }
// });



// CRON JOB SETUP
const CRON_SCHEDULE = envVars.NODE_ENV === 'production'
  ? '0 0 * * *'      // Production: Daily at midnight
  : '*/30 * * * *';  // Development: Every 30 minutes for testing

cron.schedule(CRON_SCHEDULE, async () => {
  try {
    console.log("Node cron called at:", new Date());
    await travelPlanService.updateTravelPlanStatuses();

  } catch (error) {
    console.error(`
💥 ===== CRON JOB EXCEPTION =====
Error: ${error instanceof Error ? error.message : 'Unknown error'}
Stack: ${error instanceof Error ? error.stack : 'N/A'}
=================================
    `);
  }
});


// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Server is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Backed boilerplate server running",
    port: envVars.PORT,
    timestamp: new Date().toISOString(),
  });
});

// Application routes
app.use("/api/v1", router);

// Handle 404 routes
app.all(/.*/, (req: Request) => {
  throw new NotFoundError(req.originalUrl);
});

// Global error handler
app.use(globalErrorHandler);

export default app;
