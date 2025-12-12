"use strict";
// import envVars from "./env";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const env_1 = __importDefault(require("./env"));
cloudinary_1.v2.config({
    // cloud_name: "do8p0imvw",
    // api_key: "641338269544869",
    // api_secret: "emsb0K7rggaKAWOvIyjUfL32bD4",
    cloud_name: env_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.default.CLOUDINARY_API_KEY,
    api_secret: env_1.default.CLOUDINARY_API_SECRET,
});
exports.default = cloudinary_1.v2;
