import "./Calendar.css";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7 AM to 10 PM

export default function Calendar({ tasks = [], currentDate }) {
  const formatHour = (hour) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${ampm}`;
  };

  const getTaskPosition = (task) => {
    if (!task.start_time || !task.end_time) return { top: "0px", height: "60px" };
    
    const [startHour, startMin] = task.start_time.split(":").map(Number);
    const [endHour, endMin] = task.end_time.split(":").map(Number);
    
    const startOffset = (startHour - 7) * 60 + startMin;
    const duration = (endHour - startHour) * 60 + (endMin - startMin);
    
    return {
      top: `${startOffset}px`,
      height: `${Math.max(duration, 30)}px`,
    };
  };

  const getTasksForDate = () => {
    if (!currentDate || !tasks.length) return [];
    const dateStr = currentDate.toISOString().split("T")[0];
    return tasks.filter((task) => task.date === dateStr);
  };

  const todayTasks = getTasksForDate();

  return (
    <div className="calendar">
      <div className="calendar-grid">
        <div className="time-column">
          {HOURS.map((hour) => (
            <div key={hour} className="time-slot">
              <span className="time-label">{formatHour(hour)}</span>
            </div>
          ))}
        </div>
        <div className="events-column">
          {HOURS.map((hour) => (
            <div key={hour} className="hour-row" />
          ))}
          <div className="events-container">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="event-block"
                style={{
                  ...getTaskPosition(task),
                  backgroundColor: task.color || "#3498db",
                }}
              >
                <span className="event-title">{task.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
