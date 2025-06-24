import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { registerValidation, loginValidation } from '../validations/authValidation.js';
import upload from '../middlewares/multerMiddleware.js';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getUserProfile, 
    updateUser, 
    getAllUsers, 
    deleteUser, 
    getUserById 
} from '../controllers/userController.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

// public routes
router.post('/register', registerValidation, validateRequest, registerUser);
router.post('/login', loginValidation, validateRequest, loginUser);
router.post('/logout', logoutUser);

// protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('pic'), updateUser);

// admin routes
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;