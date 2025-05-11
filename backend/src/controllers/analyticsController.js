const Task = require("../models/Task");

exports.getTaskInsights = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({});
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const pendingTasks = await Task.countDocuments({ status: "pending" });
    const inProgressTasks = await Task.countDocuments({ status: "in-progress" });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      completionRate: (completedTasks / totalTasks) * 100 || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
