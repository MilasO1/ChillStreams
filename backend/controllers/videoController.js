import asyncHandler from '../middlewares/asyncHandler.js';
import Video from '../models/Video.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import fs from 'fs';


const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description, genre } = req.body;
  

    if (!req.files?.video || !req.files?.thumbnail) {
      res.status(400);
      throw new Error('Video and thumbnail are required');
    }
  

    let videoResponse, thumbnailResponse;
    try {
      videoResponse = await uploadToCloudinary(req.files.video[0].path);
      thumbnailResponse = await uploadToCloudinary(req.files.thumbnail[0].path);
      
      if (!videoResponse || !thumbnailResponse) {
        throw new Error('Cloudinary upload failed');
      }
    } catch (error) {
      // clean up temp files if upload fails
      [req.files.video[0].path, req.files.thumbnail[0].path].forEach(path => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
      });
        console.error('Cloudinary error details:', error);
      res.status(500);
      throw new Error('File upload failed: ' + error.message);
    }
  
    
    const video = await Video.create({
      title,
      description,
      genre,
      url: videoResponse.secure_url,
      thumbnail: thumbnailResponse.secure_url,
      publicId: videoResponse.public_id
    });
  
    
    [req.files.video[0].path, req.files.thumbnail[0].path].forEach(path => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    });
  
    res.status(201).json(video);
  });


const getVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({});
  res.json(videos);
});


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
  
    
    if (req.body.title) video.title = req.body.title;
    if (req.body.description) video.description = req.body.description;
    if (req.body.genre) video.genre = req.body.genre;
  
    
    if (req.files?.video) {
      await deleteFromCloudinary(video.publicId, 'video'); // delete old video
      const videoResponse = await uploadToCloudinary(req.files.video[0].path); // autodeletes local file
      video.url = videoResponse.secure_url;
      video.publicId = videoResponse.public_id;
    }
  
    if (req.files?.thumbnail) {
      const oldThumbnailPublicId = video.thumbnail.split('/').pop().split('.')[0];
      await deleteFromCloudinary(oldThumbnailPublicId, 'image');
      const thumbnailResponse = await uploadToCloudinary(req.files.thumbnail[0].path); // autodeletes local file
      video.thumbnail = thumbnailResponse.secure_url;
    }
  
    const updatedVideo = await video.save();
    res.json(updatedVideo);
  });


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