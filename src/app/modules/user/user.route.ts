import { Router } from "express";
import userController from "./user.controller";
import { userValidation } from "./user.validation";
import { CheckAuth } from "../../middlewares/checkAuth";
import { validationRequest } from "../../middlewares/validationRequest";
import { fileUploader } from "../../../app/helper/fileUploader"
import { Role } from "@prisma/client";

const router = Router();


router.get(
    '/',
    // CheckAuth(Role.ADMIN),
    userController.getAllUsers
);

router.get(
    '/me',
    CheckAuth(Role.USER, Role.ADMIN),
    userController.getMyProfile
);

router.get(
    '/:id',
    // CheckAuth(Role.ADMIN),
    userController.getUserById
);


router.get(
    '/stats/:id',
    CheckAuth(Role.USER, Role.ADMIN),
    userController.getUserStats
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