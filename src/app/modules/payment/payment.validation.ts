// import { SubscriptionPlan } from "prisma/generated/prisma/enums";
import { SubscriptionPlan } from "@prisma/client";
import z from "zod";
// import { SubscriptionPlan } from "../../../../prisma/generated/prisma/enums";

export const createPaymentValidation = z.object({
    plan: z.enum(SubscriptionPlan, {
        error: 'Subscription plan is required',
    }),
    // paymentMethod: z.string({
    //     error: 'Payment method is required',
    // }).min(2, 'Payment method is required'),
})