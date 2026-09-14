import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

type BadgeTone = 'neutral' | 'accent' | 'success';

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-ink/5 text-ink-muted',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
};

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
