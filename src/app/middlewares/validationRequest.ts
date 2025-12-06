/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validationRequest =
  (zodSchema: ZodType<any, any, any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log('req.body==>', req.body);
        if (req?.body?.data) {
          const parsed = JSON.parse(req.body.data)
          req.body = await zodSchema.parseAsync(parsed);
          next();
        } else {
          req.body = await zodSchema.parseAsync(req.body);
          next();
        }
      } catch (err) {
        next(err);
      }
    };
