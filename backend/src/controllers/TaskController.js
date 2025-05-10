const Task = require("../models/Task");

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { title, priority } = req.body;
    const task = new Task({ title, priority });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
