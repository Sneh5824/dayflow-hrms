import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import ScheduledTasks from './components/ScheduledTasks'
import { Task, fetchTasks, createTask, updateTask, deleteTask } from './services/api'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await fetchTasks()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = await createTask(task)
      setTasks([...tasks, newTask])
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleUpdateTask = async (id: number, task: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(id, task)
      setTasks(tasks.map(t => t.id === id ? updatedTask : t))
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id)
      setTasks(tasks.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="app">
      <div className="sidebar">
        <h2 className="sidebar-title">Scheduled</h2>
        <ScheduledTasks 
          tasks={tasks} 
          loading={loading}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
      <div className="main-content">
        <div className="header">
          <div className="date-navigation">
            <button className="nav-btn" onClick={() => navigateDate('prev')}>‹</button>
            <button className="today-btn" onClick={goToToday}>Today</button>
            <button className="nav-btn" onClick={() => navigateDate('next')}>›</button>
          </div>
          <h1 className="current-date">{formatDateHeader(currentDate)}</h1>
        </div>
        <Calendar 
          tasks={tasks} 
          currentDate={currentDate}
          onUpdateTask={handleUpdateTask}
        />
      </div>
    </div>
  )
}

export default App
