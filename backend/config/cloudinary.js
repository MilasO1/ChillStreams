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
      resource_type: "auto", // automatically detects image/video
      chunk_size: 10000000, // 10MB chunks
      timeout: 300000, // 5 min timeout
      use_filename: true,
      unique_filename: true,
      // optional progress monitoring, work in progress (literally)
      onProgress: (progress) => {
      console.log(`Progress: ${progress.percent}%`);
      }
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