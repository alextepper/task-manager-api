const { Router } = require('express');
const dbController = require('../controllers/dbController');
const { body } = require('express-validator');


const validateTask = [
    body('title').notEmpty().withMessage('Name is required'),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
];

const router = Router();

router.get('/tasks', dbController.getAll);
router.get('/tasks/:id', dbController.getTaskById);
router.put('/tasks/:id', validateTask, dbController.updateTask);
router.post('/tasks', validateTask, dbController.postNew);
router.delete('/tasks/:id', dbController.deleteTaskById);

module.exports = router