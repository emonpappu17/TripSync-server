import catchAsync from "app/utils/catchAsync";
import { Request, Response } from "express";

const createUser = catchAsync(async (req: Request, res: Response) => {

})

export const authController = {
    createUser
};