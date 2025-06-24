import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { 
  uploadVideo, 
  getVideos, 
  getVideoById, 
  updateVideo,
  deleteVideo 
} from '../controllers/videoController.js';
import upload from '../middlewares/multerMiddleware.js';

const router = express.Router();

// public routes
router.get('/', getVideos);
router.get('/:id', getVideoById);

// admin routes
router.post('/', protect, admin, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), uploadVideo);


router.put('/:id', protect, admin, upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]), updateVideo); 

router.delete('/:id', protect, admin, deleteVideo);

export default router;