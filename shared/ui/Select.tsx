import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/lib/cn';
import { controlBorderClassName, controlClassName } from './control';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends ComponentPropsWithRef<'select'> {
  options: readonly SelectOption[];
  placeholder?: string;
  invalid?: boolean;
}

export function Select({ options, placeholder, invalid, className, ...rest }: SelectProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={cn(controlClassName, controlBorderClassName(invalid), className)}
      {...rest}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
