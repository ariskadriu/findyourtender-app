'use client';

import { useState, useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

class ToastManager {
  private listeners: ((toasts: Toast[]) => void)[] = [];
  private toasts: Toast[] = [];

  subscribe(listener: (t: Toast[]) => void) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  show(message: string, type: Toast['type'] = 'info') {
    const id = Math.random().toString(36).slice(2);
    this.toasts = [...this.toasts, { id, message, type }];
    this.listeners.forEach(l => l(this.toasts));
    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.listeners.forEach(l => l(this.toasts));
  }
}

export const toastManager = new ToastManager();
export const toast = {
  success: (msg: string) => toastManager.show(msg, 'success'),
  error: (msg: string) => toastManager.show(msg, 'error'),
  info: (msg: string) => toastManager.show(msg, 'info'),
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return toastManager.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-600 text-white' :
            toast.type === 'error' ? 'bg-red-600 text-white' :
            'bg-[#1A3A6B] text-white'
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => toastManager.dismiss(toast.id)}
            className="text-white/70 hover:text-white ml-2"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
