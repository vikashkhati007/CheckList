import Store from "electron-store";

const store = new Store();

export const saveTasks = (tasks) => {
  store.set('tasks', tasks);
};

export const loadTasks = () => {
  return store.get('tasks', []);
};
