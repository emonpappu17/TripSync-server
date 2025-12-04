import { SubscriptionPlan } from "@prisma/enums";
import z from "zod";

export const createPaymentValidation = z.object({
    plan: z.enum(SubscriptionPlan, {
        error: 'Subscription plan is required',
    }),
    // paymentMethod: z.string({
    //     error: 'Payment method is required',
    // }).min(2, 'Payment method is required'),
})