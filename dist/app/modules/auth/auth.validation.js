"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const zod_1 = require("zod");
exports.registerValidation = zod_1.z.object({
    email: zod_1.z.email('Invalid email format'),
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters'),
    // .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    //     'Password must contain uppercase, lowercase, number and special character'
    // ),
    fullName: zod_1.z.string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must not exceed 100 characters'),
});
exports.loginValidation = zod_1.z.object({
    email: zod_1.z.email('Invalid email format'),
    password: zod_1.z.string(),
});
