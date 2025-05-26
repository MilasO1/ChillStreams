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

        const { success, score, action } = response.data;

        // For reCAPTCHA v3, check score (0.0 to 1.0, higher is more likely human)
        // For reCAPTCHA v2, just check success
        if (!success || (score && score < 0.5)) {
            res.status(400);
            throw new Error('reCAPTCHA verification failed. Please try again.');
        }

        // Log for monitoring
        console.log(`reCAPTCHA verification successful. Score: ${score}, Action: ${action}`);
        
        next();
    } catch (error) {
        console.error('reCAPTCHA verification error:', error.message);
        res.status(500);
        throw new Error('reCAPTCHA verification service unavailable');
    }
});

export default verifyRecaptcha;