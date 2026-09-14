export const controlClassName =
  'bg-surface text-ink h-9 w-full rounded-md border px-3 text-sm transition-colors focus:outline-2 focus:outline-offset-1 focus:outline-accent disabled:cursor-not-allowed disabled:opacity-50';

export function controlBorderClassName(invalid: boolean | undefined): string {
  return invalid ? 'border-accent' : 'border-line';
}
