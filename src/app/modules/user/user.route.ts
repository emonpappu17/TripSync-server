import { Router } from "express";
import userController from "./user.controller";
import { CheckAuth } from "app/middlewares/checkAuth";
import { Role } from "@prisma/enums";
import { fileUploader } from "app/helper/fileUploader";
import { validationRequest } from "app/middlewares/validationRequest";
import { userValidation } from "./user.validation";

const router = Router();

router.get(
    '/',
    CheckAuth(Role.ADMIN),
    userController.getAllUsers
);

router.get(
    '/me',
    CheckAuth(Role.USER, Role.ADMIN),
    userController.getMyProfile
);

router.get(
    '/:id',
    CheckAuth(Role.ADMIN),
    userController.getUserById
);

router.patch(
    '/update-my-profile',
    CheckAuth(Role.ADMIN, Role.USER),
    fileUploader.upload.single("file"),
    validationRequest(userValidation),
    userController.updateMyProfile
);

router.patch(
    '/:id/status',
    CheckAuth(Role.ADMIN),
    userController.changeUserStatus
);

router.delete(
    '/:id',
    CheckAuth(Role.ADMIN),
    userController.deleteUser
);


export const userRoutes = router;