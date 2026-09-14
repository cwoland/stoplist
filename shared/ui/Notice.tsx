import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface NoticeProps {
  title: string;
  description?: string;
  tone?: 'neutral' | 'error';
  action?: ReactNode;
}

export function Notice({ title, description, tone = 'neutral', action }: NoticeProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={cn(
        'bg-surface flex flex-col items-center gap-3 rounded-xl border px-6 py-12 text-center',
        tone === 'error' ? 'border-accent/30' : 'border-line',
      )}
    >
      <p className={cn('text-base font-medium', tone === 'error' && 'text-accent')}>{title}</p>
      {description && <p className="text-ink-muted max-w-md text-sm">{description}</p>}
      {action}
    </div>
  );
}
