import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

  console.log("Cloudinary config check:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "YES" : "NO",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "YES" : "NO",
  });
};

export default connectCloudinary;
