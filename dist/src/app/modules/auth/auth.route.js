"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const validationRequest_1 = require("app/middlewares/validationRequest");
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const auth_validation_1 = require("./auth.validation");
// import { validationRequest } from "src/app/middlewares/validationRequest";
const router = (0, express_1.Router)();
router.post('/register', (0, validationRequest_1.validationRequest)(auth_validation_1.registerValidation), auth_controller_1.default.register);
router.post('/login', (0, validationRequest_1.validationRequest)(auth_validation_1.loginValidation), auth_controller_1.default.login);
// router.post(
//     '/logout',
//     CheckAuth(Role.USER, Role.ADMIN),
//     authController.logout
// );
exports.authRoutes = router;
