import { validationRequest } from "app/middlewares/validationRequest";
import { Router } from "express";
import { registerValidation } from "./auth.validation";
import authController from "./auth.controller";

const router = Router();

router.post(
    '/register',
    validationRequest(registerValidation),
    authController.register
);


export const authRoutes = router;