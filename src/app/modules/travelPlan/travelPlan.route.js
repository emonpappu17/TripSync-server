"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelPlanRoutes = void 0;
const enums_1 = require("@prisma/enums");
const fileUploader_1 = require("app/helper/fileUploader");
const checkAuth_1 = require("app/middlewares/checkAuth");
const validationRequest_1 = require("app/middlewares/validationRequest");
const express_1 = require("express");
const travelPlan_controller_1 = __importDefault(require("./travelPlan.controller"));
const travelPlan_validation_1 = require("./travelPlan.validation");
// import { CheckAuth } from "src/app/middlewares/checkAuth";
// import { fileUploader } from "src/app/helper/fileUploader";
// import { validationRequest } from "src/app/middlewares/validationRequest";
// import { fileUploader } from "app/helper/fileUploader";
const router = (0, express_1.Router)();
// Public routes
router.get('/', travelPlan_controller_1.default.getTravelPlans);
router.get('/:id', travelPlan_controller_1.default.getTravelPlanById);
router.get('/user/:id', travelPlan_controller_1.default.getTravelPlanByUserId);
// Protected routes
router.post('/', (0, checkAuth_1.CheckAuth)(enums_1.Role.USER, enums_1.Role.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (0, validationRequest_1.validationRequest)(travelPlan_validation_1.createTravelPlanValidation), travelPlan_controller_1.default.createTravelPlan);
router.get('/my/plans', (0, checkAuth_1.CheckAuth)(enums_1.Role.USER, enums_1.Role.ADMIN), travelPlan_controller_1.default.getMyTravelPlans);
router.patch('/:id', (0, checkAuth_1.CheckAuth)(enums_1.Role.USER, enums_1.Role.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (0, validationRequest_1.validationRequest)(travelPlan_validation_1.updateTravelPlanValidation), travelPlan_controller_1.default.updateTravelPlan);
router.delete('/:id', (0, checkAuth_1.CheckAuth)(enums_1.Role.USER, enums_1.Role.ADMIN), travelPlan_controller_1.default.deleteTravelPlan);
exports.travelPlanRoutes = router;
