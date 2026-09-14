'use client';

import { AnimatePresence, motion } from 'motion/react';
import { memo } from 'react';
import { cn } from '@/shared/lib/cn';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Spinner } from '@/shared/ui/Spinner';
import type { MenuItem, MenuItemStatus } from '@/types/menu';
import { SHOP_LABELS } from '../model/filters';
import { formatStopUntil } from '../model/format';
import { STOP_REASON_LABELS } from '../model/stop-item-schema';
import { canResume, RESUME_BLOCKED_REASON } from '../model/stop-rules';

interface StopListTableProps {
  items: MenuItem[];
  pendingIds: ReadonlySet<string>;
  isStale?: boolean;
  onStop: (item: MenuItem) => void;
  onResume: (item: MenuItem) => void;
}

const CELL = 'px-4 py-3';

export function StopListTable({
  items,
  pendingIds,
  isStale,
  onStop,
  onResume,
}: StopListTableProps) {
  return (
    <div
      aria-busy={isStale || undefined}
      className={cn(
        'border-line bg-surface overflow-x-auto rounded-xl border transition-opacity',
        isStale && 'opacity-60',
      )}
    >
      <table className="w-full min-w-[880px] text-sm">
        <thead className="text-ink-muted text-left text-xs tracking-wide uppercase">
          <tr>
            <th className={cn(CELL, 'font-medium')}>Позиция</th>
            <th className={cn(CELL, 'font-medium')}>Цех</th>
            <th className={cn(CELL, 'text-right font-medium')}>Остаток</th>
            <th className={cn(CELL, 'font-medium')}>Статус</th>
            <th className={cn(CELL, 'w-64')}>
              <span className="sr-only">Действия</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <StopListRow
                key={item.id}
                item={item}
                pending={pendingIds.has(item.id)}
                onStop={onStop}
                onResume={onResume}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

interface StopListRowProps {
  item: MenuItem;
  pending: boolean;
  onStop: (item: MenuItem) => void;
  onResume: (item: MenuItem) => void;
}

const StopListRow = memo(function StopListRow({
  item,
  pending,
  onStop,
  onResume,
}: StopListRowProps) {
  const stopped = item.status.kind === 'stopped';

  return (
    <motion.tr
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'border-line border-t transition-colors',
        stopped && 'bg-canvas/60 text-ink-muted',
      )}
    >
      <td className={cn(CELL, 'font-medium')}>{item.title}</td>
      <td className={CELL}>
        <Badge>{SHOP_LABELS[item.shop]}</Badge>
      </td>
      <td className={cn(CELL, 'text-right tabular-nums')}>{item.stock}</td>
      <td className={CELL}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={item.status} />
          {pending && (
            <Badge>
              <Spinner className="size-3" />
              сохраняется
            </Badge>
          )}
        </div>
      </td>
      <td className={cn(CELL, 'text-right')}>
        <div className="flex justify-end gap-2">
          {stopped ? (
            <>
              <Button variant="ghost" disabled={pending} onClick={() => onStop(item)}>
                Изменить
              </Button>
              <Button
                variant="secondary"
                disabled={pending}
                disabledReason={canResume(item) ? undefined : RESUME_BLOCKED_REASON}
                onClick={() => onResume(item)}
              >
                Вернуть в продажу
              </Button>
            </>
          ) : (
            <Button variant="secondary" disabled={pending} onClick={() => onStop(item)}>
              В стоп-лист
            </Button>
          )}
        </div>
      </td>
    </motion.tr>
  );
});

function StatusBadge({ status }: { status: MenuItemStatus }) {
  return (
    <motion.span
      key={status.kind}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="inline-flex"
    >
      {status.kind === 'available' ? (
        <Badge tone="success">В продаже</Badge>
      ) : (
        <Badge tone="accent">
          {STOP_REASON_LABELS[status.reason]} · {formatStopUntil(status.until)}
        </Badge>
      )}
    </motion.span>
  );
}

export function StopListTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-label="Загружаем меню"
      className="border-line bg-surface animate-pulse rounded-xl border"
    >
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="border-line flex items-center gap-6 border-t px-4 py-4 first:border-t-0"
        >
          <div className="bg-ink/10 h-4 w-48 rounded" />
          <div className="bg-ink/10 h-4 w-16 rounded-full" />
          <div className="bg-ink/10 h-4 w-8 rounded" />
          <div className="bg-ink/10 h-4 w-40 rounded-full" />
          <div className="bg-ink/10 ml-auto h-8 w-32 rounded-md" />
        </div>
      ))}
    </div>
  );
}
