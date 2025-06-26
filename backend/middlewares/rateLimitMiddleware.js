import rateLimit from 'express-rate-limit';


export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});


export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests
    skipSuccessfulRequests: true,
});

//WIP
export const twoFactorLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 2FA attempts per windowMs
    message: {
        error: 'Too many two-factor authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});


export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 registration attempts per hour
    message: {
        error: 'Too many registration attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});