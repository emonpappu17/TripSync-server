"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userActionValidation = void 0;
const zod_1 = require("zod");
exports.userActionValidation = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID'),
    action: zod_1.z.enum(['BLOCK', 'UNBLOCK', 'DELETE', 'VERIFY']),
    reason: zod_1.z.string().max(500).optional(),
});
