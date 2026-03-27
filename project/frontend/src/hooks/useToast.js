/**
 * Toast Hook
 * Person 4: Integration Engineer
 */

import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: Date.now() + Math.random(),
          ...toast,
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

export const useToast = () => {
  const { addToast, removeToast, toasts } = useToastStore();

  const showToast = (message, type = 'info', duration = 5000) => {
    addToast({ message, type, duration });
  };

  const success = (message, duration) => showToast(message, 'success', duration);
  const error = (message, duration) => showToast(message, 'error', duration);
  const warning = (message, duration) => showToast(message, 'warning', duration);
  const info = (message, duration) => showToast(message, 'info', duration);

  return {
    showToast,
    success,
    error,
    warning,
    info,
    toasts,
    removeToast,
  };
};

export default useToast;
