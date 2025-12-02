// import envVars from "./env";

import { v2 as cloudinary } from "cloudinary";

// cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
// api_key: envVars.CLOUDINARY_API_KEY,
// api_secret: envVars.CLOUDINARY_API_SECRET,
cloudinary.config({
    cloud_name: "do8p0imvw",
    api_key: "641338269544869",
    api_secret: "emsb0K7rggaKAWOvIyjUfL32bD4",
});

// console.log('envVars.CLOUDINARY_API_SECRET==>', envVars.CLOUDINARY_API_SECRET);
// console.log('envVars.CLOUDINARY_API_KEYT==>', envVars.CLOUDINARY_API_KEY);
// console.log('envVars.CLOUDINARY_API_SECRET==>', envVars.CLOUDINARY_CLOUD_NAME);

export default cloudinary;
