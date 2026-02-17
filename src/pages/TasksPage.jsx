import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { getTimeRemaining } from "../utils/timeUtils";
import { Plus, Trash2, Check } from "lucide-react";

function TasksPage({ searchTerm }) {
  const { tasks, addTask, deleteTask, updateTask } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description &&
      task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">

      {filteredTasks.map((task) => {

        let countdownText = "";
        let titleColor = "text-zinc-200";

        if (task.deadline && task.status !== "completed") {
          const { status, hours, minutes } =
            getTimeRemaining(task.deadline);

          countdownText =
            status === "overdue"
              ? `Overdue by ${hours}h ${minutes}m`
              : `Due in ${hours}h ${minutes}m`;

          if (status === "overdue") titleColor = "text-red-500";
        }

        const isEditing = editingId === task.id;

        return (
          <div
            key={task.id}
            className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-2"
          >

            <div className="flex items-start gap-4">

              {/* Checkbox */}
              <button
                onClick={() => toggleComplete(task)}
                className={`mt-1 w-5 h-5 rounded border flex items-center justify-center ${
                  task.status === "completed"
                    ? "bg-green-500 border-green-500"
                    : "border-zinc-600"
                }`}
              >
                {task.status === "completed" && (
                  <Check size={14} className="text-black" />
                )}
              </button>

              <div className="flex-1 space-y-1">

                {/* TITLE */}
                {isEditing ? (
                  <input
                    value={editData.title}
                    autoFocus
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        title: e.target.value,
                      })
                    }
                    onBlur={() => {
                      updateTask(task.id, editData);
                      setEditingId(null);
                    }}
                    className="w-full bg-transparent text-zinc-200 text-lg font-semibold outline-none"
                  />
                ) : (
                  <div
                    onClick={() => {
                      setEditingId(task.id);
                      setEditData(task);
                    }}
                    className={`text-lg font-semibold cursor-pointer ${titleColor}`}
                  >
                    {task.title}
                  </div>
                )}

                {/* DESCRIPTION */}
                {isEditing ? (
                  <textarea
                    value={editData.description || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        description: e.target.value,
                      })
                    }
                    onBlur={() => {
                      updateTask(task.id, editData);
                      setEditingId(null);
                    }}
                    className="w-full bg-transparent text-zinc-400 outline-none resize-none"
                  />
                ) : (
                  task.description && (
                    <div
                      onClick={() => {
                        setEditingId(task.id);
                        setEditData(task);
                      }}
                      className="text-zinc-400 cursor-text"
                    >
                      {task.description}
                    </div>
                  )
                )}

                {/* DEADLINE */}
                {isEditing ? (
                  <input
                    type="datetime-local"
                    value={
                      editData.deadline
                        ? new Date(editData.deadline)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        deadline: e.target.value,
                      })
                    }
                    onBlur={() => {
                      updateTask(task.id, editData);
                      setEditingId(null);
                    }}
                    className="bg-transparent text-zinc-400 outline-none"
                  />
                ) : (
                  countdownText && (
                    <div className="text-sm text-zinc-500">
                      {countdownText}
                    </div>
                  )
                )}

              </div>

              {/* Delete */}
              <button
                onClick={() => deleteTask(task.id)}
                className="text-zinc-500 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>

            </div>
          </div>
        );
      })}

      {/* Floating Add Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center shadow-lg hover:bg-zinc-800 transition"
      >
        <Plus size={20} className="text-zinc-300" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4 border border-zinc-800">

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-200 rounded-lg px-4 py-2 outline-none"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-200 rounded-lg px-4 py-2 outline-none"
            />

            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-200 rounded-lg px-4 py-2 outline-none"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleAdd();
                  setShowModal(false);
                }}
                className="bg-white text-black px-4 py-2 rounded-lg"
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
