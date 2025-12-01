import { z } from 'zod';

export const registerValidation = z.object({
    email: z.email('Invalid email format'),

    password: z.string()
        .min(8, 'Password must be at least 8 characters'),
    // .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    //     'Password must contain uppercase, lowercase, number and special character'
    // ),

    fullName: z.string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must not exceed 100 characters'),
})

export const loginValidation = z.object({
    email: z.email('Invalid email format'),
    password: z.string(),
})