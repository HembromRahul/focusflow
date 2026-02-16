const STORAGE_KEY = "focusflow_tasks";

export function getTasks() {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function addTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

export function deleteTask(id) {
  const tasks = getTasks().filter(task => task.id !== id);
  saveTasks(tasks);
}
