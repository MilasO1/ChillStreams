import { body } from 'express-validator';

export const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('recaptchaToken')
        .notEmpty()
        .withMessage('reCAPTCHA verification is required')
];

export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    body('recaptchaToken')
        .notEmpty()
        .withMessage('reCAPTCHA verification is required')
];

export const twoFactorValidation = [
    body('token')
        .optional()
        .isLength({ min: 6, max: 6 })
        .withMessage('Two-factor token must be 6 digits')
        .isNumeric()
        .withMessage('Two-factor token must be numeric'),
    
    body('backupCode')
        .optional()
        .isLength({ min: 8, max: 8 })
        .withMessage('Backup code must be 8 characters')
        .isAlphanumeric()
        .withMessage('Backup code must be alphanumeric'),
    
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid user ID format')
];