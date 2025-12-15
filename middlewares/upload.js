// import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tickets", // folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
  },
});

const upload = multer({ storage });

export default upload;
