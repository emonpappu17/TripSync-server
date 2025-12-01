import { authRoutes } from "app/modules/auth/auth.route";
import { UserRoutes } from "app/modules/user/user.route";
import { Router } from "express";

export const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/user",
        route: UserRoutes
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})