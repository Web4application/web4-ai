const analyzeTask = require("../../ai-modules/task-analysis/analyzeTask");

exports.analyzeTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const analysis = await analyzeTask(task.title);
    task.analysis = analysis;
    await task.save();

    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
