import { z } from 'zod';
export const userActionValidation = z.object({
    userId: z.string().uuid('Invalid user ID'),
    action: z.enum(['BLOCK', 'UNBLOCK', 'DELETE', 'VERIFY']),
    reason: z.string().max(500).optional(),
});
