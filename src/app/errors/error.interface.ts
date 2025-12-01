export interface IApiError extends Error {
  statusCode: number;
  success: boolean;
  errorMessages: { path: string; message: string }[];
  stack?: string;
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorMessages: { path: string; message: string }[];
  stack?: string;
}
