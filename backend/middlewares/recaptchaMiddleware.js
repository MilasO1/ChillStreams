import axios from 'axios';
import asyncHandler from './asyncHandler.js';

const verifyRecaptcha = asyncHandler(async (req, res, next) => {
    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
        res.status(400);
        throw new Error('reCAPTCHA token is required');
    }

    try {
        // Verify reCAPTCHA with Google's API
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                    response: recaptchaToken,
                    remoteip: req.ip
                }
            }
        );

        const { success, 'error-codes': errorCodes } = response.data;

        // For reCAPTCHA v2, we only need to check success
        if (!success) {
            console.error('reCAPTCHA verification failed:', errorCodes);
            res.status(400);
            throw new Error('reCAPTCHA verification failed. Please try again.');
        }

        // Log for monitoring
        console.log('reCAPTCHA v2 verification successful');
        
        next();
    } catch (error) {
        if (error.response) {
            // Error from Google's API
            console.error('reCAPTCHA API error:', error.response.data);
            res.status(400);
            throw new Error('reCAPTCHA verification failed');
        } else {
            // Network or other error
            console.error('reCAPTCHA verification error:', error.message);
            res.status(500);
            throw new Error('reCAPTCHA verification service unavailable');
        }
    }
});

export default verifyRecaptcha;