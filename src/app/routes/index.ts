import { adminRoutes } from "app/modules/admin/admin.route";
import { authRoutes } from "app/modules/auth/auth.route";
import { paymentRoutes } from "app/modules/payment/payment.route";
import { reviewRoutes } from "app/modules/review/review.route";
import { travelPlanRoutes } from "app/modules/travelPlan/travelPlan.route";
import { travelRequestRouters } from "app/modules/travelRequest/travelRequest.route";
import { userRoutes } from "app/modules/user/user.route";

import { Router } from "express";

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