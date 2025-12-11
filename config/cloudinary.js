import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dtfahmfdw",
  api_key: process.env.CLOUDINARY_API_KEY || "415827612945613",
  api_secret: process.env.CLOUDINARY_API_SECRET || "sxax4EvyXOrCJl2WSugMwJrb2JQ",
});

export default cloudinary;
