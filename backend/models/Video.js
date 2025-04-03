import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  url: { // Cloudinary URL
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  publicId: { // Cloudinary public ID
    type: String,
    required: true,
  },
  genre: {
    type: String,
    enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi', 'Thriller'],
    required: true,
  },
}, { timestamps: true });

// Add text index for search
videoSchema.index({ title: 'text', description: 'text', genre: 'text' });

const Video = mongoose.model("Video", videoSchema);

export default Video;