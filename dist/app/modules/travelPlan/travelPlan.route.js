"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelPlanRoutes = void 0;
// import { Role } from "prisma/generated/prisma/enums";
// import { fileUploader } from "app/helper/fileUploader";
// import { CheckAuth } from "app/middlewares/checkAuth";
// import { validationRequest } from "app/middlewares/validationRequest";
const express_1 = require("express");
const travelPlan_controller_1 = __importDefault(require("./travelPlan.controller"));
const travelPlan_validation_1 = require("./travelPlan.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const fileUploader_1 = require("../../helper/fileUploader");
const validationRequest_1 = require("../../middlewares/validationRequest");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Public routes
router.get('/', travelPlan_controller_1.default.getTravelPlans);
router.get('/:id', travelPlan_controller_1.default.getTravelPlanById);
router.get('/user/:id', travelPlan_controller_1.default.getTravelPlanByUserId);
// Protected routes
router.post('/', (0, checkAuth_1.CheckAuth)(client_1.Role.USER, client_1.Role.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (0, validationRequest_1.validationRequest)(travelPlan_validation_1.createTravelPlanValidation), travelPlan_controller_1.default.createTravelPlan);
router.get('/my/plans', (0, checkAuth_1.CheckAuth)(client_1.Role.USER, client_1.Role.ADMIN), travelPlan_controller_1.default.getMyTravelPlans);
router.patch('/:id', (0, checkAuth_1.CheckAuth)(client_1.Role.USER, client_1.Role.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (0, validationRequest_1.validationRequest)(travelPlan_validation_1.updateTravelPlanValidation), travelPlan_controller_1.default.updateTravelPlan);
router.delete('/:id', (0, checkAuth_1.CheckAuth)(client_1.Role.USER, client_1.Role.ADMIN), travelPlan_controller_1.default.deleteTravelPlan);
exports.travelPlanRoutes = router;
