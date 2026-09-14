import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/lib/cn';
import { controlBorderClassName, controlClassName } from './control';

interface InputProps extends ComponentPropsWithRef<'input'> {
  invalid?: boolean;
}

export function Input({ invalid, className, ...rest }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(controlClassName, controlBorderClassName(invalid), className)}
      {...rest}
    />
  );
}
