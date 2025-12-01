import { prisma } from "app/lib/prisma";
import sendResponse from "app/utils/sendResponse";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.post('/create-user', async (req: Request, res: Response) => {
    const data = req.body;
    const user = await prisma.user.create({
        data
    })

    await prisma.authProvider.create({
        data: {
            provider: "google",
            providerId: "google-123456",
            userId: "a7250b6c-1266-4d05-bde2-e98d2c15d7f3",
        }
    })

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User created successfully',
        data: user
    })
})

export const UserRoutes = router;