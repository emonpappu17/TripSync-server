// /* eslint-disable no-useless-escape */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import envVars from "app/config/env";
// import { v2 as cloudinary } from "cloudinary";
// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

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



import multer from 'multer'
import path from 'path'
import { v2 as cloudinary } from "cloudinary"
import envVars from 'app/config/env'
// import config from '../../config'

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "/uploads"))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: Express.Multer.File) => {
    // Configuration
    cloudinary.config({
        cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
        api_key: envVars.CLOUDINARY_API_KEY,
        api_secret: envVars.CLOUDINARY_API_SECRET,
    });

    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(
            file.path, {
            public_id: file.filename,
        }
        )
        .catch((error) => {
            console.log(error);
        });

    // console.log(uploadResult);

    return uploadResult;
}

export const fileUploader = {
    upload,
    uploadToCloudinary
}

