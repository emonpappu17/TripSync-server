import { authRoutes } from "app/modules/auth/auth.route";
import { reviewRoutes } from "app/modules/review/review.route";
import { travelPlanRoutes } from "app/modules/travelPlan/travelPlan.route";
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
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})