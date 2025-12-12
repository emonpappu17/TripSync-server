"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentValidation = void 0;
// import { SubscriptionPlan } from "prisma/generated/prisma/enums";
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
// import { SubscriptionPlan } from "../../../../prisma/generated/prisma/enums";
exports.createPaymentValidation = zod_1.default.object({
    plan: zod_1.default.enum(client_1.SubscriptionPlan, {
        error: 'Subscription plan is required',
    }),
    // paymentMethod: z.string({
    //     error: 'Payment method is required',
    // }).min(2, 'Payment method is required'),
});
