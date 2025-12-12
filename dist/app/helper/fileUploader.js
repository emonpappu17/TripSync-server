"use strict";
// /* eslint-disable no-useless-escape */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import envVars from "app/config/env";
// import { v2 as cloudinary } from "cloudinary";
// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
// cloudinary.config({
//     cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
//     api_key: envVars.CLOUDINARY_API_KEY,
//     api_secret: envVars.CLOUDINARY_API_SECRET,
// });
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "travel-plans", //  Keep files organized
//         resource_type: "auto",  //  Auto-detects image/video/pdf
//         public_id: (req: any, file: any) => {
//             const fileName = file.originalname
//                 .toLowerCase()
//                 .replace(/\s+/g, "-")
//                 .replace(/\./g, "-")
//                 .replace(/[^a-z0-9\-\.]/g, ""); // Clean filename
//             // Generate unique ID without extension (Cloudinary adds extension automatically)
//             return Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName;
//         }
//     } as any 
// });
// const upload = multer({ storage: storage });
// export const fileUploader = {
//     upload,
// };
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const env_1 = __importDefault(require("../config/env"));
// import envVars from 'app/config/env'
// import config from '../../config'
// Set up multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), "/uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const uploadToCloudinary = async (file) => {
    // Configuration
    cloudinary_1.v2.config({
        cloud_name: env_1.default.CLOUDINARY_CLOUD_NAME,
        api_key: env_1.default.CLOUDINARY_API_KEY,
        api_secret: env_1.default.CLOUDINARY_API_SECRET,
    });
    // Upload an image
    const uploadResult = await cloudinary_1.v2.uploader
        .upload(file.path, {
        public_id: file.filename,
    })
        .catch((error) => {
        console.log(error);
    });
    // console.log(uploadResult);
    return uploadResult;
};
exports.fileUploader = {
    upload,
    uploadToCloudinary
};
