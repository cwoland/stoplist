import { create } from 'zustand';

export type ToastTone = 'error' | 'success';

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
}

const TOAST_TTL_MS = 5_000;
let nextId = 0;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (toast) => {
    const id = ++nextId;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => get().dismiss(id), TOAST_TTL_MS);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
