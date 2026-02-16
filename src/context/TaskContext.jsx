import { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
 const [tasks, setTasks] = useState(() => {
  const stored = localStorage.getItem("tasks");
  if (!stored) return [];

  const parsed = JSON.parse(stored);

  // Auto-migrate old tasks
  return parsed.map((task) => ({
    status: task.status ?? "active",
    completedAt: task.completedAt ?? null,
    ...task
  }));
});


  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add Task
  const addTask = (title, deadline, description = "") => {
    const newTask = {
      id: Date.now(),
      title,
      description,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      createdAt: new Date().toISOString(),
      status: "active",            // NEW
      completedAt: null            // NEW
    };

    setTasks((prev) => [...prev, newTask]);
  };

  // Mark Task as Completed (NEW)
  const completeTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "completed",
              completedAt: new Date().toISOString()
            }
          : task
      )
    );
  };

  // Optional: Undo completion
  const restoreTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "active",
              completedAt: null
            }
          : task
      )
    );
  };

  // Update Task
  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updatedFields,
              deadline: updatedFields.deadline
                ? new Date(updatedFields.deadline).toISOString()
                : task.deadline
            }
          : task
      )
    );
  };

  // Hard Delete (we will stop using this soon)
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        restoreTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
