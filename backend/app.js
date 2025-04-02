import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import connectDB from './config/db.js';
import morganMiddleware from './middlewares/morganMiddleware.js';

dotenv.config();

connectDB();

const app = express();

app.use(morganMiddleware);


app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;