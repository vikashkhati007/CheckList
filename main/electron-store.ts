import Store from "electron-store";

const store = new Store();

export const saveData = (data) => {
    store.set('data', data);
};

export const loadData = () => {
  return store.get('data', { privateGroups: [] });
};

