"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRequestStatusValidation = exports.createTravelRequestValidation = void 0;
const enums_1 = require("@prisma/enums");
const zod_1 = __importDefault(require("zod"));
exports.createTravelRequestValidation = zod_1.default.object({
    travelPlanId: zod_1.default.string({
        error: 'Travel plan ID is required',
    }).uuid('Invalid travel plan ID'),
    message: zod_1.default.string()
        .max(500, 'Message must not exceed 500 characters')
        .optional(),
});
exports.updateRequestStatusValidation = zod_1.default.object({
    status: zod_1.default.enum(enums_1.RequestStatus, {
        error: 'Status is required',
    }),
});
