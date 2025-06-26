import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    cb(null, `${uuidv4()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  
  if (
    file.mimetype === 'video/mp4' || 
    file.mimetype === 'video/webm' ||
    file.mimetype === 'image/jpeg' || 
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 , // 500MB max
  },
  fileFilter
}); 

export default upload;