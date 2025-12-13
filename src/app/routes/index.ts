import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";
import { travelPlanRoutes } from "../modules/travelPlan/travelPlan.route";
import { reviewRoutes } from "../modules/review/review.route";
import { travelRequestRouters } from "../modules/travelRequest/travelRequest.route";
import { travelMatchRoutes } from "../modules/travelMatch/travelMatch.routes";
import { paymentRoutes } from "../modules/payment/payment.route";
import { adminRoutes } from "../modules/admin/admin.route";

export const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/travelPlan",
        route: travelPlanRoutes
    },
    {
        path: "/review",
        route: reviewRoutes
    },
    {
        path: "/travelRequest",
        route: travelRequestRouters
    },
    {
        path: "/travelMatch",
        route: travelMatchRoutes
    },
    {
        path: "/payment",
        route: paymentRoutes
    },
    {
        path: "/admin",
        route: adminRoutes
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})