'use client';

import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/shared/lib/cn';
import { useToastStore } from './toast-store';

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed right-6 bottom-6 z-50 flex w-80 max-w-[calc(100vw-3rem)] flex-col gap-2"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg',
              toast.tone === 'error'
                ? 'border-accent/30 bg-accent-soft text-accent'
                : 'border-success/30 bg-success-soft text-success',
            )}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              aria-label="Закрыть уведомление"
              onClick={() => dismiss(toast.id)}
              className="-m-1 rounded p-1 leading-none opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
