/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import envVars from "app/config/env";
import { v2 as cloudinary } from "cloudinary";
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "travel-plans", //  Keep files organized
        resource_type: "auto",  //  Auto-detects image/video/pdf
        public_id: (req: any, file: any) => {
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/\./g, "-")
                .replace(/[^a-z0-9\-\.]/g, ""); // Clean filename

            // Generate unique ID without extension (Cloudinary adds extension automatically)
            return Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName;
        }
    } as any 
});

const upload = multer({ storage: storage });

export const fileUploader = {
    upload,
};



