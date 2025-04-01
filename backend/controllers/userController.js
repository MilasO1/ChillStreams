import jwt from 'jsonwebtoken';
import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }
    // Check if user exists
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }
    // Create user
    const user = await User.create({
        name,
        email,
        password,
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid user data')
    }
}
)

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    // Check for user email
    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({message: 'Logged out'})
})

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
        })
    }
    else{
        res.status(404)
        throw new Error('User not found')
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.pic = req.body.pic || user.pic

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            pic: updatedUser.pic,
            message: 'Profile updated successfully',
        })
    }
    else{
        res.status(404)
        throw new Error('User not found')
    }
})

const getAllUsers = asyncHandler(async (req, res) => {
        const users = await User.find({})
        res.status(200).json(users)
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if(!user){
        res.status(404)
        throw new Error('User not found')
        }
        await user.remove()
        res.status(200).json({
            message: 'User removed'
        })
})

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if(!user){
        res.status(404)
        throw new Error('User not found')
        }
        res.status(200).json(user)
})

export {registerUser, loginUser, logoutUser, getUserProfile, updateUser, getAllUsers, deleteUser, getUserById}




