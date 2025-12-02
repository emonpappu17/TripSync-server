import cloudinary from 'app/config/cloudinary.config'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
// import config from '../../config'

// Set up multer for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(process.cwd(), "/uploads"))
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
// })

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        public_id: (req, file) => {
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/\./g, "-")
                // eslint-disable-next-line no-useless-escape
                .replace(/[^a-z0-9\-\.]/g, "")

            const extension = file.originalname.split(".").pop()

            const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "." + extension

            return uniqueFileName
        }
    }
})

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: Express.Multer.File) => {
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

    return uploadResult;
}

export const fileUploader = {
    upload,
    uploadToCloudinary
}
