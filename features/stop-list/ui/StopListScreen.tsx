'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { Button } from '@/shared/ui/Button';
import { Notice } from '@/shared/ui/Notice';
import { Spinner } from '@/shared/ui/Spinner';
import type { MenuItem, StopItemPayload } from '@/types/menu';
import { hasActiveFilters, type StopListFilters } from '../model/filters';
import { menuItemsQueryOptions } from '../model/queries';
import { useStopPanelStore } from '../model/stop-panel-store';
import { useSetFilters } from '../model/use-filters';
import { usePendingItemIds, useResumeItem, useStopItem } from '../model/use-stop-item';
import { Filters } from './Filters';
import { StopListTable, StopListTableSkeleton } from './StopListTable';
import { StopReasonPanel } from './StopReasonPanel';

interface StopListScreenProps {
  filters: StopListFilters;
}

export function StopListScreen({ filters }: StopListScreenProps) {
  const setFilters = useSetFilters();
  const itemsQuery = useQuery(menuItemsQueryOptions(filters));
  const pendingIds = usePendingItemIds();
  const { mutate: stop, isPending: isStopping } = useStopItem();
  const { mutate: resume } = useResumeItem();

  const panelItemId = useStopPanelStore((state) => state.itemId);
  const panelMode = useStopPanelStore((state) => state.mode);
  const openPanel = useStopPanelStore((state) => state.open);
  const closePanel = useStopPanelStore((state) => state.close);

  const panelItem = useMemo(
    () => itemsQuery.data?.find((item) => item.id === panelItemId) ?? null,
    [itemsQuery.data, panelItemId],
  );

  const handleResume = useCallback((item: MenuItem) => resume({ id: item.id }), [resume]);

  const handleStopSubmit = useCallback(
    (payload: StopItemPayload) => {
      if (!panelItemId) return;
      stop({ id: panelItemId, payload }, { onSuccess: closePanel });
    },
    [panelItemId, stop, closePanel],
  );

  return (
    <div className="flex flex-col gap-6">
      <Filters value={filters} onChange={setFilters} />

      {itemsQuery.isPending ? (
        <StopListTableSkeleton />
      ) : itemsQuery.data === undefined ? (
        <Notice
          tone="error"
          title={itemsQuery.error.message}
          description="Сервер не ответил. Попробуйте загрузить список ещё раз."
          action={
            <Button
              variant="secondary"
              loading={itemsQuery.isFetching}
              loadingText="Загружаем…"
              onClick={() => itemsQuery.refetch()}
            >
              Повторить
            </Button>
          }
        />
      ) : itemsQuery.data.length === 0 ? (
        <Notice
          title="Ничего не найдено"
          description={
            hasActiveFilters(filters)
              ? 'По выбранным фильтрам позиций нет.'
              : 'В меню смены пока нет позиций.'
          }
          action={
            hasActiveFilters(filters) && (
              <Button variant="secondary" onClick={() => setFilters({})}>
                Сбросить фильтры
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="text-ink-muted flex min-h-6 items-center gap-3 text-sm">
            <span>Позиций: {itemsQuery.data.length}</span>
            {itemsQuery.isFetching && <Spinner className="size-3" />}
            {itemsQuery.isError && !itemsQuery.isFetching && (
              <span className="text-accent flex items-center gap-2">
                Не удалось обновить список
                <Button variant="ghost" className="h-6 px-2" onClick={() => itemsQuery.refetch()}>
                  Повторить
                </Button>
              </span>
            )}
          </div>
          <StopListTable
            items={itemsQuery.data}
            pendingIds={pendingIds}
            isStale={itemsQuery.isPlaceholderData}
            onStop={openPanel}
            onResume={handleResume}
          />
        </>
      )}

      <StopReasonPanel
        item={panelItem}
        mode={panelMode}
        isSubmitting={isStopping}
        onSubmit={handleStopSubmit}
        onClose={closePanel}
      />
    </div>
  );
}
