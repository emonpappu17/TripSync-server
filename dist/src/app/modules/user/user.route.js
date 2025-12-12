"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const checkAuth_1 = require("app/middlewares/checkAuth");
const enums_1 = require("@prisma/enums");
// import { CheckAuth } from "src/app/middlewares/checkAuth";
// import { fileUploader } from "src/app/helper/fileUploader";
// import { validationRequest } from "src/app/middlewares/validationRequest";
// import { userValidation } from "./user.validation";
// import { fileUploader } from "app/helper/fileUploader";
const validationRequest_1 = require("app/middlewares/validationRequest");
const user_validation_1 = require("./user.validation");
const fileUploader_1 = require("app/helper/fileUploader");
const router = (0, express_1.Router)();
router.get('/', (0, checkAuth_1.CheckAuth)(enums_1.Role.ADMIN), user_controller_1.default.getAllUsers);
router.get('/me', (0, checkAuth_1.CheckAuth)(enums_1.Role.USER, enums_1.Role.ADMIN), user_controller_1.default.getMyProfile);
router.get('/:id', 
// CheckAuth(Role.ADMIN),
user_controller_1.default.getUserById);
router.get('/stats/:id', (0, checkAuth_1.CheckAuth)(enums_1.Role.USER, enums_1.Role.ADMIN), user_controller_1.default.getUserStats);
router.patch('/update-my-profile', (0, checkAuth_1.CheckAuth)(enums_1.Role.ADMIN, enums_1.Role.USER), fileUploader_1.fileUploader.upload.single("file"), (0, validationRequest_1.validationRequest)(user_validation_1.userValidation), user_controller_1.default.updateMyProfile);
router.patch('/:id/status', (0, checkAuth_1.CheckAuth)(enums_1.Role.ADMIN), user_controller_1.default.changeUserStatus);
router.delete('/:id', (0, checkAuth_1.CheckAuth)(enums_1.Role.ADMIN), user_controller_1.default.deleteUser);
exports.userRoutes = router;
