const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatStopUntil(until: string | null, now = new Date()): string {
  if (until === null) return 'до конца смены';
  const date = new Date(until);
  const sameDay = date.toDateString() === now.toDateString();
  return `до ${sameDay ? timeFormat.format(date) : dateTimeFormat.format(date)}`;
}
