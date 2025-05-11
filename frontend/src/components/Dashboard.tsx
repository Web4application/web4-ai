import React, { useState, useEffect } from "react";
import TaskFilter from "./TaskFilter";
import { getTasks, updateTaskPriority } from "../services/taskService";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async (filters = {}) => {
    try {
      const data = await getTasks(filters);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handlePriorityUpdate = async (id: string, priority: string) => {
    try {
      await updateTaskPriority(id, priority);
      fetchTasks();
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
      <TaskFilter onFilterChange={fetchTasks} />

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="bg-gray-100 p-4 rounded shadow">
            <h3>{task.title}</h3>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>

            <select onChange={(e) => handlePriorityUpdate(task._id, e.target.value)} defaultValue={task.priority}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
