import React, { useState } from "react";
import { analyzeTask } from "../services/api";

const TaskAnalysis: React.FC = () => {
  const [task, setTask] = useState("");
  const [analysis, setAnalysis] = useState("");

  const handleAnalyze = async () => {
    try {
      const result = await analyzeTask(task);
      setAnalysis(result);
    } catch {
      setAnalysis("Error analyzing task.");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg mb-4">
      <h2 className="text-xl font-bold mb-2">Task Analysis</h2>
      <textarea
        className="w-full p-2 mb-2 border border-gray-300 rounded"
        rows={3}
        placeholder="Enter task description..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      ></textarea>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAnalyze}>
        Analyze
      </button>
      {analysis && <p className="mt-4 bg-white p-2 rounded shadow">{analysis}</p>}
    </div>
  );
};

export default TaskAnalysis;
