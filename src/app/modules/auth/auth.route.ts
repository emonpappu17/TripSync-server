import { validationRequest } from "app/middlewares/validationRequest";
import { Router } from "express";
import { loginValidation, registerValidation } from "./auth.validation";
import authController from "./auth.controller";

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


export const authRoutes = router;