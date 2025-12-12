"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, response) => {
    const { statusCode, success, message, data, meta, err } = response;
    const responsePayload = {
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
exports.default = sendResponse;
