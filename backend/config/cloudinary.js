import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(process.cwd(), '.env') });

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      throw new Error("File doesn't exist locally");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically detects image/video
      chunk_size: 6000000, // 6MB chunks
      timeout: 60000 // 60-second timeout
    });

    if (!response?.secure_url) {
      throw new Error("Cloudinary returned invalid response");
    }

    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Cloudinary upload error:", error.message);
    return null;
  }
};


const deleteFromCloudinary = async (publicId, resourceType = "video") => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
  }
};

export { cloudinary, uploadToCloudinary, deleteFromCloudinary };