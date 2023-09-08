const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const TASKS_FILE = path.resolve(__dirname, '../tasks.json');

module.exports.getAll = (req, res) => {

    fs.readFile(TASKS_FILE, (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to read tasks' });
        }
        res.send(JSON.parse(data));
    });
}

module.exports.getTaskById = (req, res) => {
    const taskId = parseInt(req.params.id);

    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to read tasks' });
        }

        try {
            let tasks = JSON.parse(data);
            let task = tasks.find(task => task.id === taskId);

            if (!task) {
                return res.status(404).send({ error: 'Task not found' });
            }

            res.send(task);
        } catch (parseErr) {
            res.status(500).send({ error: 'Failed to parse tasks' });
        }
    });
}

module.exports.postNew = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const newTask = req.body;
    fs.readFile(TASKS_FILE, (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to read tasks' });
        }

        const tasks = JSON.parse(data);
        let newId = tasks.length + 1;
        newTask.id = newId;
        tasks.push(newTask);

        fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 4), (err) => {
            if (err) {
                return res.status(500).send({ error: 'Failed to save task' });
            }

            res.send({ success: true, task: newTask });
        });
    });
}

module.exports.updateTask = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const taskId = parseInt(req.params.id); // assuming ID is an integer; adjust if it's a string
    const updatedData = req.body;

    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to read tasks' });
        }

        let tasks = JSON.parse(data);
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        // If task is not found, return a 404 error
        if (taskIndex === -1) {
            return res.status(404).send({ error: 'Task not found' });
        }

        // Update the task data
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };

        // Save updated tasks back to file
        fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 4), 'utf8', (err) => {
            if (err) {
                return res.status(500).send({ error: 'Failed to write to file' });
            }
            res.send(tasks[taskIndex]);
        });
    });
};

module.exports.deleteTaskById = (req, res) => {
    const taskId = parseInt(req.params.id); // assuming ID is an integer; adjust if it's a string

    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to read tasks' });
        }

        let tasks = JSON.parse(data);
        const initialLength = tasks.length;

        // Filter out the task with the given ID
        tasks = tasks.filter(task => task.id !== taskId);

        if (initialLength === tasks.length) { // If lengths are the same, task was not found
            return res.status(404).send({ error: 'Task not found' });
        }

        // Save the modified tasks list back to the file
        fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 4), 'utf8', (err) => {
            if (err) {
                return res.status(500).send({ error: 'Failed to write to file' });
            }
            res.status(200).send({ message: 'Task deleted successfully' });
        });
    });
};