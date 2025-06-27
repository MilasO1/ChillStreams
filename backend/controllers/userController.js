import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('Email already in use');
    }

    const user = await User.create({ name, email, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            isAdmin: user.isAdmin,
            token: user.getSignedJwtToken(),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            message: 'Logged in successfully',
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            isAdmin: user.isAdmin,
            token: user.getSignedJwtToken(),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Store old profile pic path for cleanup
    const oldPicPath = user.pic;
    const defaultPic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

    try {
        // Update basic fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        // Handle profile picture update
        if (req.file) {
            // New image uploaded
            const imageUrl = `/uploads/${req.file.filename}`;
            user.pic = imageUrl;
            
            // Clean up old image file (if it's not the default image and exists locally)
            if (oldPicPath && 
                oldPicPath !== defaultPic && 
                !oldPicPath.startsWith('http') && 
                oldPicPath.startsWith('/uploads/')) {
                
                const oldFilePath = path.join(process.cwd(), 'uploads', path.basename(oldPicPath));
                try {
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                } catch (cleanupError) {
                    console.error('Error cleaning up old profile image:', cleanupError);
                    // Don't throw error for cleanup failure
                }
            }
        }
        
        // Handle password update
        if (req.body.password && req.body.password.trim() !== '') {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            pic: updatedUser.pic,
            isAdmin: updatedUser.isAdmin,
            message: 'Profile updated successfully',
        });
        
    } catch (error) {
        // If something goes wrong and we uploaded a new file, clean it up
        if (req.file) {
            const newFilePath = path.join(process.cwd(), 'uploads', req.file.filename);
            try {
                if (fs.existsSync(newFilePath)) {
                    fs.unlinkSync(newFilePath);
                }
            } catch (cleanupError) {
                console.error('Error cleaning up uploaded file after error:', cleanupError);
            }
        }
        throw error;
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    // Clean up user's profile image before deletion
    const defaultPic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    if (user.pic && 
        user.pic !== defaultPic && 
        !user.pic.startsWith('http') && 
        user.pic.startsWith('/uploads/')) {
        
        const filePath = path.join(process.cwd(), 'uploads', path.basename(user.pic));
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (cleanupError) {
            console.error('Error cleaning up user profile image:', cleanupError);
        }
    }
    
    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user);
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUser,
    getAllUsers,
    deleteUser,
    getUserById
};


