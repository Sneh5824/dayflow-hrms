import { useState, useEffect } from "react";
import Calendar from "../../components/Calendar";
import ScheduledTasks from "../../components/ScheduledTasks";
import { fetchTasks, createTask, deleteTask } from "../../services/api";
import "./SchedulePage.css";

export default function SchedulePage() {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (task) => {
    try {
      const newTask = await createTask(task);
      if (newTask) setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());

  const formatDateHeader = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="schedule-page">
      <div className="schedule-sidebar">
        <h2 className="sidebar-title">Scheduled</h2>
        <ScheduledTasks
          tasks={tasks}
          loading={loading}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          currentDate={currentDate}
        />
      </div>
      <div className="schedule-content">
        <div className="schedule-header">
          <div className="date-navigation">
            <button className="nav-btn" onClick={() => navigateDate("prev")}>‹</button>
            <button className="today-btn" onClick={goToToday}>Today</button>
            <button className="nav-btn" onClick={() => navigateDate("next")}>›</button>
          </div>
          <h1 className="current-date">{formatDateHeader(currentDate)}</h1>
        </div>
        <Calendar tasks={tasks} currentDate={currentDate} />
      </div>
    </div>
  );
}
