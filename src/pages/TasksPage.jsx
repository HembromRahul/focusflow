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

  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingDescId, setEditingDescId] = useState(null);
  const [editingDeadlineId, setEditingDeadlineId] = useState(null);
  const [editValue, setEditValue] = useState("");

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

        const isCompleted = task.status === "completed";

        let countdownText = "";

        if (task.deadline && !isCompleted) {
          const { status, hours, minutes } =
            getTimeRemaining(task.deadline);

          countdownText =
            status === "overdue"
              ? `Overdue by ${hours}h ${minutes}m`
              : `Due in ${hours}h ${minutes}m`;
        }

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
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : "border-zinc-600"
                }`}
              >
                {isCompleted && (
                  <Check size={14} className="text-black" />
                )}
              </button>

              <div className="flex-1 space-y-1">

                {/* TITLE */}
                {editingTitleId === task.id ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => {
                      updateTask(task.id, { title: editValue });
                      setEditingTitleId(null);
                    }}
                    className="w-full bg-transparent outline-none text-lg font-semibold"
                  />
                ) : (
                  <div
                    onClick={() => {
                      setEditingTitleId(task.id);
                      setEditValue(task.title);
                    }}
                    className={`text-lg font-semibold cursor-pointer ${
                      isCompleted
                        ? "line-through text-zinc-500"
                        : "text-zinc-200"
                    }`}
                  >
                    {task.title}
                  </div>
                )}

                {/* DESCRIPTION */}
                {editingDescId === task.id ? (
                  <textarea
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => {
                      updateTask(task.id, { description: editValue });
                      setEditingDescId(null);
                    }}
                    className="w-full bg-transparent text-zinc-400 outline-none resize-none"
                  />
                ) : (
                  task.description && (
                    <div
                      onClick={() => {
                        setEditingDescId(task.id);
                        setEditValue(task.description);
                      }}
                      className={`cursor-text ${
                        isCompleted
                          ? "line-through text-zinc-600"
                          : "text-zinc-400"
                      }`}
                    >
                      {task.description}
                    </div>
                  )
                )}

                {/* DEADLINE */}
                {editingDeadlineId === task.id ? (
                  <input
                    type="datetime-local"
                    autoFocus
                    value={
                      editValue
                        ? new Date(editValue)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => {
                      updateTask(task.id, { deadline: editValue });
                      setEditingDeadlineId(null);
                    }}
                    className="bg-transparent text-zinc-400 outline-none"
                  />
                ) : (
                  countdownText && (
                    <div
                      onClick={() => {
                        setEditingDeadlineId(task.id);
                        setEditValue(task.deadline);
                      }}
                      className="text-sm text-zinc-500 cursor-pointer"
                    >
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
        className="fixed bottom-6 right-6 w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center"
      >
        <Plus size={20} className="text-zinc-300" />
      </button>

      {/* Add Modal */}
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
