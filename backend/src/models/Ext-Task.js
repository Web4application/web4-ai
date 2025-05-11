status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
tags: [{ type: String }],
