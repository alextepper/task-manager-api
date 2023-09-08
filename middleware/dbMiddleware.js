const { body, validationResult } = require('express-validator');

module.exports.validateTask = [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];
