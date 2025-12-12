// import { validationRequest } from "app/middlewares/validationRequest";
import { Router } from "express";
import authController from "./auth.controller";
import { loginValidation, registerValidation } from "./auth.validation";
import { validationRequest } from "src/app/middlewares/validationRequest";

const router = Router();

router.post(
    '/register',
    validationRequest(registerValidation),
    authController.register
);

router.post(
    '/login',
    validationRequest(loginValidation),
    authController.login
);

// router.post(
//     '/logout',
//     CheckAuth(Role.USER, Role.ADMIN),
//     authController.logout
// );



export const authRoutes = router;