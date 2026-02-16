import { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import { getTimeRemaining } from "../utils/timeUtils";

function TasksPage() {
 
const { tasks, addTask, completeTask, updateTask } = useTasks();

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingDescriptionId, setEditingDescriptionId] = useState(null);
  const [editData, setEditData] = useState({});

  const [now, setNow] = useState(new Date());

  // Refresh countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask(title, deadline, description);
    setTitle("");
    setDeadline("");
    setDescription("");
  };

  return (
    <div>
      <h2>Tasks</h2>

      {/* Add Task */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Add details (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            display: "block",
            marginTop: "8px",
            width: "100%",
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            color: "#d1d5db",
            padding: "6px",
            borderRadius: "4px"
          }}
        />

        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ marginTop: "8px" }}
        />

        <button onClick={handleAdd} style={{ marginTop: "8px" }}>
          Add
        </button>
      </div>

      {/* Task List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks
  .filter((task) => task.status === "active")
  .sort((a, b) => {
    const now = new Date();

    // No deadline = lowest priority
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;

    const aTime = new Date(a.deadline) - now;
    const bTime = new Date(b.deadline) - now;

    // Overdue first
    if (aTime < 0 && bTime >= 0) return -1;
    if (bTime < 0 && aTime >= 0) return 1;

    // Otherwise sort by nearest deadline
    return aTime - bTime;
  })
  .map((task) => {


          let titleColor = "#d1d5db";
          let countdownColor = "#9ca3af";
          let countdownText = "";

          if (task.deadline) {
            const { status, hours, minutes, urgencyLevel } =
              getTimeRemaining(task.deadline);

            countdownText =
              status === "overdue"
                ? `Overdue by ${hours}h ${minutes}m`
                : `Due in ${hours}h ${minutes}m`;

            if (status === "overdue") {
              titleColor = "#ef4444";
              countdownColor = "#ef4444";
            } else if (urgencyLevel === 3) {
              titleColor = "#ff6b6b";
              countdownColor = "#ff6b6b";
            } else if (urgencyLevel === 2) {
              titleColor = "#fbbf24";
              countdownColor = "#fbbf24";
            }
          }

          return (
            <li key={task.id} style={{ marginBottom: "28px" }}>

              {/* TITLE */}
              {editingTitleId === task.id ? (
                <div
                  tabIndex={0}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      updateTask(task.id, editData);
                      setEditingTitleId(null);
                      setEditData({});
                    }
                  }}
                  style={{
                    marginTop: "6px",
                    padding: "10px",
                    backgroundColor: "#151515",
                    borderRadius: "6px"
                  }}
                >
                  {/* Title Input */}
                  <input
                    autoFocus
                    type="text"
                    value={editData.title ?? task.title}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        title: e.target.value
                      }))
                    }
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      color: "#d1d5db",
                      border: "none",
                      outline: "none",
                      fontWeight: "600",
                      fontSize: "16px"
                    }}
                  />

                  {/* Deadline Input */}
                  <input
                    type="datetime-local"
                    value={
                      editData.deadline ??
                      (task.deadline
                        ? new Date(task.deadline)
                            .toISOString()
                            .slice(0, 16)
                        : "")
                    }
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        deadline: e.target.value
                      }))
                    }
                    style={{
                      marginTop: "6px",
                      backgroundColor: "transparent",
                      color: "#9ca3af",
                      border: "none",
                      outline: "none"
                    }}
                  />

                  {/* Created Date */}
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginTop: "8px"
                    }}
                  >
                    Created:
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af"
                    }}
                  >
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleString()
                      : "—"}
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setEditingTitleId(task.id);
                    setEditData(task);
                  }}
                  style={{
                    fontWeight: "600",
                    color: titleColor,
                    cursor: "pointer"
                  }}
                >
                  {task.title}
                </div>
              )}

              {/* DESCRIPTION */}
              {editingDescriptionId === task.id ? (
                <textarea
                  autoFocus
                  value={editData.description ?? task.description ?? ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                  onBlur={() => {
                    updateTask(task.id, editData);
                    setEditingDescriptionId(null);
                    setEditData({});
                  }}
                  style={{
                    marginTop: "4px",
                    width: "100%",
                    backgroundColor: "transparent",
                    color: "#9ca3af",
                    border: "none",
                    outline: "none",
                    resize: "none",
                    padding: "0",
                    fontSize: "13px",
                    minHeight: "18px"
                  }}
                />
              ) : (
                task.description && (
                  <div
                    onClick={() => {
                      setEditingDescriptionId(task.id);
                      setEditData(task);
                    }}
                    style={{
                      fontSize: "13px",
                      color: "#9ca3af",
                      marginTop: "4px",
                      cursor: "text"
                    }}
                  >
                    {task.description}
                  </div>
                )
              )}

              {/* Countdown */}
              {task.deadline && (
                <div
                  style={{
                    fontSize: "12px",
                    color: countdownColor,
                    marginTop: "4px"
                  }}
                >
                  {countdownText}
                </div>
              )}

              <button
  onClick={() => completeTask(task.id)}
  style={{ marginTop: "6px", color: "#22c55e" }}
>
  Complete
</button>


            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TasksPage;
