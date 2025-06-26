import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videoRoutes.js'; 
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import connectDB from './config/db.js';
import morganMiddleware from './middlewares/morganMiddleware.js';

dotenv.config();

// Database connection
connectDB();

const app = express();

const allowedOrigins = [
  'https://chill-streams.vercel.app',
]
// Middlewares
app.use(morganMiddleware);
app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '500mb' })); // Increased payload limit for video uploads
app.use(express.urlencoded({ extended: true, limit: '500mb' })); // Increased payload limit for video uploads
app.use(cookieParser());


app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes); 

// health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// error handling
app.use(notFound);
app.use(errorHandler);

export default app;