import asyncHandler from '../middlewares/asyncHandler.js';
import Video from '../models/Video.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import fs from 'fs';

// @desc    Upload new video
const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description, genre } = req.body;
  
    // 1. Validate required files
    if (!req.files?.video || !req.files?.thumbnail) {
      res.status(400);
      throw new Error('Video and thumbnail are required');
    }
  
    // 2. Upload files with error handling
    let videoResponse, thumbnailResponse;
    try {
      videoResponse = await uploadToCloudinary(req.files.video[0].path);
      thumbnailResponse = await uploadToCloudinary(req.files.thumbnail[0].path);
      
      if (!videoResponse || !thumbnailResponse) {
        throw new Error('Cloudinary upload failed');
      }
    } catch (error) {
      // Clean up temp files if upload fails
      [req.files.video[0].path, req.files.thumbnail[0].path].forEach(path => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
      });
        console.error('Cloudinary error details:', error);
      res.status(500);
      throw new Error('File upload failed: ' + error.message);
    }
  
    // 3. Create video record
    const video = await Video.create({
      title,
      description,
      genre,
      url: videoResponse.secure_url,
      thumbnail: thumbnailResponse.secure_url,
      publicId: videoResponse.public_id
    });
  
    // 4. Clean up temp files
    [req.files.video[0].path, req.files.thumbnail[0].path].forEach(path => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    });
  
    res.status(201).json(video);
  });

// @desc    Get all videos
const getVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({});
  res.json(videos);
});

// @desc    Get single video
const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }
  res.json(video);
});

const updateVideo = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) {
      res.status(404);
      throw new Error('Video not found');
    }
  
    // Update text fields
    if (req.body.title) video.title = req.body.title;
    if (req.body.description) video.description = req.body.description;
    if (req.body.genre) video.genre = req.body.genre;
  
    // Update video file (if provided)
    if (req.files?.video) {
      await deleteFromCloudinary(video.publicId, 'video'); // Delete old video
      const videoResponse = await uploadToCloudinary(req.files.video[0].path); // Auto-deletes local file
      video.url = videoResponse.secure_url;
      video.publicId = videoResponse.public_id;
      // No need for fs.unlinkSync - Cloudinary's uploadToCloudinary() already does this
    }
  
    // Update thumbnail (if provided)
    if (req.files?.thumbnail) {
      const oldThumbnailPublicId = video.thumbnail.split('/').pop().split('.')[0];
      await deleteFromCloudinary(oldThumbnailPublicId, 'image');
      const thumbnailResponse = await uploadToCloudinary(req.files.thumbnail[0].path); // Auto-deletes local file
      video.thumbnail = thumbnailResponse.secure_url;
      // No need for fs.unlinkSync
    }
  
    const updatedVideo = await video.save();
    res.json(updatedVideo);
  });

// @desc    Delete video
const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  await deleteFromCloudinary(video.publicId);
  await video.deleteOne();
  res.json({ message: 'Video removed' });
});

export {
  uploadVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo
};