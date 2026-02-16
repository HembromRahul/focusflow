import { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import { getTimeRemaining } from "../utils/timeUtils";
import { Plus, Trash2, Check } from "lucide-react";

function TasksPage({ searchTerm }) {
  const { tasks, addTask, deleteTask, updateTask } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [now, setNow] = useState(new Date());

  const [reminderMinutes, setReminderMinutes] = useState(() => {
    const saved = localStorage.getItem("flow_reminder_minutes");
    return saved ? Number(saved) : 10;
  });

  const [notifiedTasks, setNotifiedTasks] = useState({});

  // ⏱ Update every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🔔 Ask permission once
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 💾 Save reminder preference
  useEffect(() => {
    localStorage.setItem("flow_reminder_minutes", reminderMinutes);
  }, [reminderMinutes]);

  const playSound = () => {
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );
    audio.play();
  };

  const vibrate = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  // 🔔 Notification engine
  useEffect(() => {
    if (!("Notification" in window)) return;

    tasks.forEach((task) => {
      if (!task.deadline || task.status === "completed") return;

      const nowTime = new Date();
      const deadlineTime = new Date(task.deadline);
      const diff = deadlineTime - nowTime;
      const minutesLeft = Math.floor(diff / 60000);

      const alreadyReminded = notifiedTasks[task.id]?.reminder;
      const alreadyOverdue = notifiedTasks[task.id]?.overdue;

      if (
        minutesLeft === reminderMinutes &&
        !alreadyReminded
      ) {
        new Notification("Reminder", {
          body: `"${task.title}" is due in ${reminderMinutes} minutes.`,
        });
        playSound();
        vibrate();

        setNotifiedTasks((prev) => ({
          ...prev,
          [task.id]: { ...prev[task.id], reminder: true },
        }));
      }

      if (minutesLeft < 0 && !alreadyOverdue) {
        new Notification("Overdue", {
          body: `"${task.title}" is now overdue.`,
        });
        playSound();
        vibrate();

        setNotifiedTasks((prev) => ({
          ...prev,
          [task.id]: { ...prev[task.id], overdue: true },
        }));
      }
    });
  }, [now, tasks, reminderMinutes, notifiedTasks]);

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask(title, deadline, description);
    setTitle("");
    setDescription("");
    setDeadline("");
  };

  const toggleComplete = (task) => {
    updateTask(task.id, {
      status: task.status === "completed" ? "active" : "completed",
      completedAt:
        task.status === "completed" ? null : new Date().toISOString(),
    });
  };

  // 🔥 SMART AUTO SORT
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      (task.description &&
        task.description
          .toLowerCase()
          .includes(searchTerm?.toLowerCase() || ""))
    )
    .sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (b.status === "completed" && a.status !== "completed") return -1;

      const nowTime = new Date();

      const getPriority = (task) => {
        if (task.status === "completed") return 5;
        if (!task.deadline) return 4;

        const diff = new Date(task.deadline) - nowTime;
        const minutes = Math.floor(diff / 60000);

        if (minutes < 0) return 1;        // Overdue
        if (minutes <= 1440) return 2;    // Due within 24h
        return 3;                         // Future active
      };

      return getPriority(a) - getPriority(b);
    });

  return (
    <div className="space-y-6 pt-20">

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          let titleColor = "text-zinc-200";
          let countdownColor = "text-zinc-400";
          let countdownText = "";

          if (task.deadline && task.status !== "completed") {
            const { status, hours, minutes, urgencyLevel } =
              getTimeRemaining(task.deadline);

            countdownText =
              status === "overdue"
                ? `Overdue by ${hours}h ${minutes}m`
                : `Due in ${hours}h ${minutes}m`;

            if (status === "overdue") {
              titleColor = "text-red-500";
              countdownColor = "text-red-500";
            } else if (urgencyLevel === 3) {
              titleColor = "text-red-400";
              countdownColor = "text-red-400";
            } else if (urgencyLevel === 2) {
              titleColor = "text-yellow-400";
              countdownColor = "text-yellow-400";
            }
          }

          return (
            <div
              key={task.id}
              className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all duration-200 flex justify-between items-start"
            >
              <div className="flex items-start gap-4 w-full">

                <button
                  onClick={() => toggleComplete(task)}
                  className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition ${
                    task.status === "completed"
                      ? "bg-green-500 border-green-500"
                      : "border-zinc-600 hover:border-white"
                  }`}
                >
                  {task.status === "completed" && (
                    <Check size={14} className="text-black" />
                  )}
                </button>

                <div className="flex-1">
                  <div
                    className={`text-lg font-semibold transition-all duration-200 ${
                      task.status === "completed"
                        ? "line-through text-zinc-500"
                        : titleColor
                    }`}
                  >
                    {task.title}
                  </div>

                  {task.description && (
                    <div
                      className={`text-sm mt-1 transition-all duration-200 ${
                        task.status === "completed"
                          ? "text-zinc-600"
                          : "text-zinc-400"
                      }`}
                    >
                      {task.description}
                    </div>
                  )}

                  {task.deadline && task.status !== "completed" && (
                    <div className={`text-sm mt-2 ${countdownColor}`}>
                      {countdownText}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-zinc-500 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:ring-2 hover:ring-white/30 hover:bg-zinc-800 transition-all duration-200"
      >
        <Plus size={20} className="text-zinc-300 hover:text-white transition" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4 border border-zinc-800">

            <h2 className="text-xl font-semibold text-zinc-200">
              New Task
            </h2>

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-200 rounded-lg px-4 py-2"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-200 rounded-lg px-4 py-2"
            />

            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-200 rounded-lg px-4 py-2"
            />

            <select
              value={reminderMinutes}
              onChange={(e) =>
                setReminderMinutes(Number(e.target.value))
              }
              className="w-full bg-zinc-800 text-zinc-200 rounded-lg px-4 py-2"
            >
              <option value={5}>Remind 5 minutes before</option>
              <option value={10}>Remind 10 minutes before</option>
              <option value={15}>Remind 15 minutes before</option>
              <option value={30}>Remind 30 minutes before</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleAdd();
                  setShowModal(false);
                }}
                className="bg-white text-black px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
