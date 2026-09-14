import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/lib/cn';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
  loading?: boolean;
  loadingText?: string;
  disabledReason?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent/90',
  secondary: 'border-line bg-surface text-ink hover:bg-canvas border',
  ghost: 'text-ink-muted hover:bg-ink/5 hover:text-ink',
};

export function Button({
  variant = 'primary',
  loading = false,
  loadingText,
  disabledReason,
  disabled,
  onClick,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isBlocked = Boolean(disabledReason);
  const isDisabled = disabled || loading || isBlocked;

  return (
    <button
      type={type}
      disabled={isDisabled && !isBlocked}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      title={disabledReason}
      onClick={isBlocked ? undefined : onClick}
      className={cn(
        'inline-flex h-9 items-center justify-center gap-2 rounded-md px-3.5 text-sm font-medium whitespace-nowrap transition-colors',
        'focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    >
      {loading && <Spinner />}
      {loading ? (loadingText ?? children) : children}
    </button>
  );
}
