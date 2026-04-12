const { body, validationResult } = require('express-validator');


exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

exports.registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['donor', 'creator']).withMessage('Invalid role')
];

exports.loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

exports.projectValidation = [
    body('title').trim().notEmpty().withMessage('Project title is required'),
    body('description').trim().notEmpty().withMessage('Project description is required'),
    body('category').isIn(['education', 'healthcare', 'environment', 'community', 'technology']).withMessage('Invalid category'),
    body('goalAmount').isNumeric().withMessage('Goal amount must be a number').custom(value => value > 0).withMessage('Goal amount must be greater than 0'),
    body('endDate').isISO8601().withMessage('Valid end date is required')
];


exports.donationValidation = [
    body('projectId').notEmpty().withMessage('Project ID is required'),
    body('amount').isNumeric().withMessage('Amount must be a number').custom(value => value > 0).withMessage('Amount must be greater than 0')
];
