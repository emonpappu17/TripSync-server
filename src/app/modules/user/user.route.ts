// import { validationRequest } from "app/middlewares/validationRequest";
import { Router } from "express";
// import { userValidation } from "./user.validation";
import userController from "./user.controller";
import { CheckAuth } from "app/middlewares/checkAuth";
import { Role } from "@prisma/enums";
import { fileUploader } from "app/helper/fileUploader";
import { validationRequest } from "app/middlewares/validationRequest";
import { userValidation } from "./user.validation";

const router = Router();

router.get(
    '/me',
    CheckAuth(Role.USER, Role.ADMIN),
    userController.getMyProfile
);

router.patch(
    // '/update-my-profile',
    '/updateUser',
    CheckAuth(Role.ADMIN, Role.USER),
    fileUploader.upload.single("file"),
    validationRequest(userValidation),
    userController.updateUser
);


export const userRoutes = router;