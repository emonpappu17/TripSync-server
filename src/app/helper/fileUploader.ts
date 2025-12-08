// // import cloudinary from 'app/config/cloudinary.config'
// // import multer from 'multer'
// // import { CloudinaryStorage } from 'multer-storage-cloudinary'
// // // import config from '../../config'

// import cloudinary from "app/config/cloudinary.config";
// import multer from "multer";

// // // Set up multer for file uploads
// // // const storage = multer.diskStorage({
// // //     destination: function (req, file, cb) {
// // //         cb(null, path.join(process.cwd(), "/uploads"))
// // //     },
// // //     filename: function (req, file, cb) {
// // //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
// // //         cb(null, file.fieldname + '-' + uniqueSuffix)
// // //     }
// // // })

// // const storage = new CloudinaryStorage({
// //     cloudinary: cloudinary,
// //     params: {
// //         public_id: (req, file) => {
// //             const fileName = file.originalname
// //                 .toLowerCase()
// //                 .replace(/\s+/g, "-")
// //                 .replace(/\./g, "-")
// //                 // eslint-disable-next-line no-useless-escape
// //                 .replace(/[^a-z0-9\-\.]/g, "")

// //             const extension = file.originalname.split(".").pop()

// //             const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "." + extension

// //             return uniqueFileName
// //         }
// //     }
// // })

// // const upload = multer({ storage: storage });

// // const uploadToCloudinary = async (file: Express.Multer.File) => {
// //     // Upload an image
// //     const uploadResult = await cloudinary.uploader
// //         .upload(
// //             file.path, {
// //             public_id: file.filename,
// //         }
// //         )
// //         .catch((error) => {
// //             console.log(error);
// //         });

// //     return uploadResult;
// // }

// // export const fileUploader = {
// //     upload,
// //     uploadToCloudinary
// // }



// import { v2 as cloudinary } from "cloudinary";
// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// // Ensure your cloudinary config is set here or imported
// cloudinary.config({
//     cloud_name: "do8p0imvw",
//     api_key: "641338269544869",
//     api_secret: "emsb0K7rggaKAWOvIyjUfL32bD4",
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         // It is often good practice to specify a folder
//         // folder: "travel-plans", 
//         public_id: (req, file) => {
//             const fileName = file.originalname
//                 .toLowerCase()
//                 .replace(/\s+/g, "-")
//                 .replace(/\./g, "-")
//                 // eslint-disable-next-line no-useless-escape
//                 .replace(/[^a-z0-9\-\.]/g, "");

//             // REMOVE the extension logic here. Cloudinary adds it automatically.
//             const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName;

//             return uniqueFileName;
//         }
//     }
// });

// const upload = multer({ storage: storage });

// const uploadToCloudinary = async (file: Express.Multer.File) => {
//     // Upload an image
//     const uploadResult = await cloudinary.uploader
//         .upload(
//             file.path, {
//             public_id: file.filename,
//         }
//         )
//         .catch((error) => {
//             console.log(error);
//         });

//     return uploadResult;
// }

// export const fileUploader = {
//     upload,
//     // uploadToCloudinary function is removed as it is not needed
// };


// import { v2 as cloudinary } from "cloudinary";
// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// // ⚠️ SECURITY TIP: Ideally, move these keys to a .env file
// cloudinary.config({
//     cloud_name: "do8p0imvw",
//     api_key: "641338269544869",
//     api_secret: "emsb0K7rggaKAWOvIyjUfL32bD4",
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         public_id: (req, file) => {
//             const fileName = file.originalname
//                 .toLowerCase()
//                 .replace(/\s+/g, "-")
//                 .replace(/\./g, "-")
//                 // eslint-disable-next-line no-useless-escape
//                 .replace(/[^a-z0-9\-\.]/g, "");

//             // Simple unique logic without the extension
//             const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName;

//             return uniqueFileName;
//         }
//     }
// });

// const upload = multer({ storage: storage });

// export const fileUploader = {
//     upload,
// };


import { v2 as cloudinary } from "cloudinary";
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: "do8p0imvw",
    api_key: "641338269544869",
    api_secret: "emsb0K7rggaKAWOvIyjUfL32bD4",
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "travel-plans", // Recommended: Keep files organized
        resource_type: "auto",  // Recommended: Auto-detects image/video/pdf
        public_id: (req, file) => {
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/\./g, "-")
                .replace(/[^a-z0-9\-\.]/g, ""); // Clean filename

            // Generate unique ID without extension (Cloudinary adds extension automatically)
            return Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName;
        }
    } as any // 'as any' helps if TypeScript complains about the params structure
});

const upload = multer({ storage: storage });

export const fileUploader = {
    upload,
};

// use memory storage
// const multerStorage = multer.memoryStorage();
// export const upload = multer({ storage: multerStorage });


// export const streamUpload = (buffer: Buffer) => new Promise<any>((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//         { folder: 'travel_plans' }, // optional params
//         (error, result) => {
//             if (error) return reject(error);
//             resolve(result);
//         }
//     );
//     stream.end(buffer);
// });


