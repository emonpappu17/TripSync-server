"use strict";
// import { adminRoutes } from "app/modules/admin/admin.route";
// import { authRoutes } from "app/modules/auth/auth.route";
// import { paymentRoutes } from "app/modules/payment/payment.route";
// import { reviewRoutes } from "app/modules/review/review.route";
// import { travelMatchRoutes } from "app/modules/travelMatch/travelMatch.routes";
// import { travelPlanRoutes } from "app/modules/travelPlan/travelPlan.route";
// import { travelRequestRouters } from "app/modules/travelRequest/travelRequest.route";
// import { userRoutes } from "app/modules/user/user.route";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const travelPlan_route_1 = require("../modules/travelPlan/travelPlan.route");
const review_route_1 = require("../modules/review/review.route");
const travelRequest_route_1 = require("../modules/travelRequest/travelRequest.route");
const travelMatch_routes_1 = require("../modules/travelMatch/travelMatch.routes");
const payment_route_1 = require("../modules/payment/payment.route");
const admin_route_1 = require("../modules/admin/admin.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.authRoutes
    },
    {
        path: "/user",
        route: user_route_1.userRoutes
    },
    {
        path: "/travelPlan",
        route: travelPlan_route_1.travelPlanRoutes
    },
    {
        path: "/review",
        route: review_route_1.reviewRoutes
    },
    {
        path: "/travelRequest",
        route: travelRequest_route_1.travelRequestRouters
    },
    {
        path: "/travelMatch",
        route: travelMatch_routes_1.travelMatchRoutes
    },
    {
        path: "/payment",
        route: payment_route_1.paymentRoutes
    },
    {
        path: "/admin",
        route: admin_route_1.adminRoutes
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
