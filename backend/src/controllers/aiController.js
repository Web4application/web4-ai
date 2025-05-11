const analyzeTask = require("../../ai-modules/task-analysis/analyzeTask");

exports.analyzeTask = async (req, res) => {
  const { taskDescription } = req.body;
  try {
    const analysis = await analyzeTask(taskDescription);
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
