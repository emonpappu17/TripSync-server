/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

interface IMEta {
  page: number;
  limit: number;
  total: number;
}

interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: IMEta;
  err?: any;
}
const sendResponse = <T>(res: Response, response: IApiResponse<T>) => {
  const { statusCode, success, message, data, meta, err } = response;
  const responsePayload: IApiResponse<T> = {
    statusCode: statusCode,
    success: success,
    message: message,
    data: data,
  };
  if (meta) {
    responsePayload.meta = meta;
  }
  if (err) {
    responsePayload.err = err;
  }

  res.status(statusCode).json(responsePayload);
};

export default sendResponse;
