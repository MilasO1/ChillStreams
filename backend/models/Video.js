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
  url: { 
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  publicId: { 
    type: String,
    required: true,
  },
  genre: {
    type: String,
    enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi', 'Thriller'],
    required: true,
  },
}, { timestamps: true });

// text index for search
videoSchema.index({ title: 'text', description: 'text', genre: 'text' });

const Video = mongoose.model("Video", videoSchema);

export default Video;