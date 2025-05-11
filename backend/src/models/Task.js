const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);
