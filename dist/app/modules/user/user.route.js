"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
// import { CheckAuth } from "app/middlewares/checkAuth";
// import { Role } from "prisma/generated/prisma/enums";
// import { CheckAuth } from "src/app/middlewares/checkAuth";
// import { fileUploader } from "src/app/helper/fileUploader";
// import { validationRequest } from "src/app/middlewares/validationRequest";
// import { userValidation } from "./user.validation";
// import { fileUploader } from "app/helper/fileUploader";
// import { validationRequest } from "app/middlewares/validationRequest";
const user_validation_1 = require("./user.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validationRequest_1 = require("../../middlewares/validationRequest");
// import { fileUploader } from "app/helper/fileUploader";
const fileUploader_1 = require("../../../app/helper/fileUploader");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get('/', (0, checkAuth_1.CheckAuth)(client_1.Role.ADMIN), user_controller_1.default.getAllUsers);
router.get('/me', (0, checkAuth_1.CheckAuth)(client_1.Role.USER, client_1.Role.ADMIN), user_controller_1.default.getMyProfile);
router.get('/:id', 
// CheckAuth(Role.ADMIN),
user_controller_1.default.getUserById);
router.get('/stats/:id', (0, checkAuth_1.CheckAuth)(client_1.Role.USER, client_1.Role.ADMIN), user_controller_1.default.getUserStats);
router.patch('/update-my-profile', (0, checkAuth_1.CheckAuth)(client_1.Role.ADMIN, client_1.Role.USER), fileUploader_1.fileUploader.upload.single("file"), (0, validationRequest_1.validationRequest)(user_validation_1.userValidation), user_controller_1.default.updateMyProfile);
router.patch('/:id/status', (0, checkAuth_1.CheckAuth)(client_1.Role.ADMIN), user_controller_1.default.changeUserStatus);
router.delete('/:id', (0, checkAuth_1.CheckAuth)(client_1.Role.ADMIN), user_controller_1.default.deleteUser);
exports.userRoutes = router;
