exports.getFilteredTasks = async (req, res) => {
  const { status, priority, sortBy } = req.query;
  let filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  try {
    const tasks = await Task.find(filter).sort({ [sortBy]: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
