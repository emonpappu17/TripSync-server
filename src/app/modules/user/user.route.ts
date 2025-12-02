import { validationRequest } from "app/middlewares/validationRequest";
import { Router } from "express";
import { userValidation } from "./user.validation";
import userController from "./user.controller";
import { CheckAuth } from "app/middlewares/checkAuth";
import { Role } from "@prisma/enums";

const router = Router();

router.patch(
    '/updateUser',
    CheckAuth(Role.ADMIN, Role.USER),
    validationRequest(userValidation),
    userController.updateUser
);


export const userRoutes = router;