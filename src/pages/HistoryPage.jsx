import { useState } from "react";
import { useTasks } from "../context/TaskContext";

function HistoryPage() {
  const { tasks, restoreTask } = useTasks();
  const [filter, setFilter] = useState("all");

  const now = new Date();

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  const filteredTasks = completedTasks.filter((task) => {
    if (!task.completedAt) return false;

    const completedDate = new Date(task.completedAt);

    if (filter === "all") return true;

    if (filter === "thisMonth") {
      return (
        completedDate.getMonth() === now.getMonth() &&
        completedDate.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "lastMonth") {
      const lastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      return (
        completedDate.getMonth() === lastMonth.getMonth() &&
        completedDate.getFullYear() === lastMonth.getFullYear()
      );
    }

    return true;
  });

  return (
    <div>
      <h2>History</h2>

      {/* Filter Dropdown */}
      <div style={{ marginBottom: "15px" }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            backgroundColor: "#1a1a1a",
            color: "#d1d5db",
            border: "1px solid #333",
            padding: "6px",
            borderRadius: "4px"
          }}
        >
          <option value="all">All Time</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
        </select>
      </div>

      {filteredTasks.length === 0 && (
        <p style={{ color: "#6b7280" }}>
          No completed tasks for this period.
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            style={{
              marginBottom: "20px",
              opacity: 0.75
            }}
          >
            <div
              style={{
                fontWeight: "600",
                textDecoration: "line-through",
                color: "#9ca3af"
              }}
            >
              {task.title}
            </div>

            {task.description && (
              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginTop: "4px"
                }}
              >
                {task.description}
              </div>
            )}

            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginTop: "6px"
              }}
            >
              Completed:{" "}
              {new Date(task.completedAt).toLocaleString()}
            </div>

            <button
              onClick={() => restoreTask(task.id)}
              style={{
                marginTop: "6px",
                color: "#3b82f6"
              }}
            >
              Restore
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryPage;
