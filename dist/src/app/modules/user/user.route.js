import { Router } from "express";
import userController from "./user.controller";
import { CheckAuth } from "app/middlewares/checkAuth";
import { Role } from "@prisma/enums";
// import { CheckAuth } from "src/app/middlewares/checkAuth";
// import { fileUploader } from "src/app/helper/fileUploader";
// import { validationRequest } from "src/app/middlewares/validationRequest";
// import { userValidation } from "./user.validation";
// import { fileUploader } from "app/helper/fileUploader";
import { validationRequest } from "app/middlewares/validationRequest";
import { userValidation } from "./user.validation";
import { fileUploader } from "app/helper/fileUploader";
const router = Router();
router.get('/', CheckAuth(Role.ADMIN), userController.getAllUsers);
router.get('/me', CheckAuth(Role.USER, Role.ADMIN), userController.getMyProfile);
router.get('/:id', 
// CheckAuth(Role.ADMIN),
userController.getUserById);
router.get('/stats/:id', CheckAuth(Role.USER, Role.ADMIN), userController.getUserStats);
router.patch('/update-my-profile', CheckAuth(Role.ADMIN, Role.USER), fileUploader.upload.single("file"), validationRequest(userValidation), userController.updateMyProfile);
router.patch('/:id/status', CheckAuth(Role.ADMIN), userController.changeUserStatus);
router.delete('/:id', CheckAuth(Role.ADMIN), userController.deleteUser);
export const userRoutes = router;
