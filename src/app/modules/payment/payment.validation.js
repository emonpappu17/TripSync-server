"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentValidation = void 0;
const enums_1 = require("@prisma/enums");
const zod_1 = __importDefault(require("zod"));
exports.createPaymentValidation = zod_1.default.object({
    plan: zod_1.default.enum(enums_1.SubscriptionPlan, {
        error: 'Subscription plan is required',
    }),
    // paymentMethod: z.string({
    //     error: 'Payment method is required',
    // }).min(2, 'Payment method is required'),
});
