// import envVars from "./env";
import { v2 as cloudinary } from "cloudinary";
import envVars from "./env";
cloudinary.config({
    // cloud_name: "do8p0imvw",
    // api_key: "641338269544869",
    // api_secret: "emsb0K7rggaKAWOvIyjUfL32bD4",
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
});
export default cloudinary;
