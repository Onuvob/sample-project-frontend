let listeners = [];
let currentError = null;

export const errorStore = {
  subscribe(callback) {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((l) => l !== callback);
    };
  },
  show(message) {
    currentError = message;
    listeners.forEach((cb) => cb(currentError));
  },
  clear() {
    currentError = null;
    listeners.forEach((cb) => cb(currentError));
  },
};
