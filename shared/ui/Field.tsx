import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function fieldErrorId(htmlFor: string) {
  return `${htmlFor}-error`;
}

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-ink text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={fieldErrorId(htmlFor)} className="text-accent text-xs">
          {error}
        </p>
      ) : (
        hint && <p className="text-ink-muted text-xs">{hint}</p>
      )}
    </div>
  );
}
