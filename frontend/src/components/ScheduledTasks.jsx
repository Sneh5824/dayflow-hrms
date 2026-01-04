import { useState } from "react";
import "./ScheduledTasks.css";

const COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c"];

export default function ScheduledTasks({ tasks = [], loading, onAddTask, onDeleteTask, currentDate }) {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    start_time: "",
    end_time: "",
    color: COLORS[0],
  });

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.title && newTask.start_time && newTask.end_time) {
      const dateStr = currentDate ? currentDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      onAddTask({
        ...newTask,
        date: dateStr,
      });
      setNewTask({ title: "", start_time: "", end_time: "", color: COLORS[0] });
      setShowForm(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="scheduled-tasks">
      <div className="tasks-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="task-item"
            style={{ borderLeftColor: task.color || "#3498db" }}
          >
            <div className="task-info">
              <span className="task-title">{task.title}</span>
              <span className="task-time">
                {formatTime(task.start_time)} - {formatTime(task.end_time)}
              </span>
            </div>
            <button className="delete-btn" onClick={() => onDeleteTask(task.id)}>
              ×
            </button>
          </div>
        ))}
        {tasks.length === 0 && <div className="no-tasks">No tasks scheduled</div>}
      </div>

      {showForm ? (
        <form className="add-task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <div className="time-inputs">
            <input
              type="time"
              value={newTask.start_time}
              onChange={(e) => setNewTask({ ...newTask, start_time: e.target.value })}
            />
            <span>to</span>
            <input
              type="time"
              value={newTask.end_time}
              onChange={(e) => setNewTask({ ...newTask, end_time: e.target.value })}
            />
          </div>
          <div className="color-picker">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-btn ${newTask.color === color ? "active" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setNewTask({ ...newTask, color })}
              />
            ))}
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Add</button>
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add Task
        </button>
      )}
    </div>
  );
}
