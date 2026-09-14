import {
  useMutation,
  useMutationState,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { getErrorMessage } from '@/shared/api/api-error';
import { useToastStore } from '@/shared/ui/toast-store';
import type { MenuItem, MenuItemStatus, StopItemPayload } from '@/types/menu';
import { resumeMenuItem, stopMenuItem } from '../api/menu-api';
import { menuKeys } from './queries';

interface ItemVars {
  id: string;
}

interface OptimisticContext {
  prevItem?: MenuItem;
}

function patchItemInLists(qc: QueryClient, id: string, patch: (item: MenuItem) => MenuItem) {
  qc.setQueriesData<MenuItem[]>({ queryKey: menuKeys.lists() }, (items) =>
    items?.map((item) => (item.id === id ? patch(item) : item)),
  );
}

function findItemInLists(qc: QueryClient, id: string): MenuItem | undefined {
  for (const [, items] of qc.getQueriesData<MenuItem[]>({ queryKey: menuKeys.lists() })) {
    const found = items?.find((item) => item.id === id);
    if (found) return found;
  }
  return undefined;
}

interface OptimisticItemMutationOptions<TVars extends ItemVars> {
  name: 'stop' | 'resume';
  mutationFn: (vars: TVars) => Promise<MenuItem>;
  optimisticStatus: (vars: TVars) => MenuItemStatus;
  fallbackErrorMessage: string;
}

function useOptimisticItemMutation<TVars extends ItemVars>({
  name,
  mutationFn,
  optimisticStatus,
  fallbackErrorMessage,
}: OptimisticItemMutationOptions<TVars>) {
  const qc = useQueryClient();
  const pushToast = useToastStore((state) => state.push);

  return useMutation<MenuItem, Error, TVars, OptimisticContext>({
    mutationKey: menuKeys.mutation(name),
    mutationFn,
    onMutate: async (vars) => {
      // Идущий рефетч не должен перезаписать оптимистичное состояние своим (устаревшим) ответом.
      await qc.cancelQueries({ queryKey: menuKeys.lists() });
      const prevItem = findItemInLists(qc, vars.id);
      patchItemInLists(qc, vars.id, (item) => ({ ...item, status: optimisticStatus(vars) }));
      return { prevItem };
    },
    onError: (error, vars, context) => {
      const prevItem = context?.prevItem;
      if (prevItem) patchItemInLists(qc, vars.id, () => prevItem);
      pushToast({ tone: 'error', message: getErrorMessage(error, fallbackErrorMessage) });
    },
    onSettled: () => {
      if (qc.isMutating({ mutationKey: menuKeys.mutations() }) === 1) {
        void qc.invalidateQueries({ queryKey: menuKeys.lists() });
      }
    },
  });
}

export function useStopItem() {
  return useOptimisticItemMutation<ItemVars & { payload: StopItemPayload }>({
    name: 'stop',
    mutationFn: ({ id, payload }) => stopMenuItem(id, payload),
    optimisticStatus: ({ payload }) => ({ kind: 'stopped', ...payload }),
    fallbackErrorMessage: 'Не удалось поставить позицию в стоп-лист',
  });
}

export function useResumeItem() {
  return useOptimisticItemMutation<ItemVars>({
    name: 'resume',
    mutationFn: ({ id }) => resumeMenuItem(id),
    optimisticStatus: () => ({ kind: 'available' }),
    fallbackErrorMessage: 'Не удалось вернуть позицию в продажу',
  });
}

function hasItemId(value: unknown): value is ItemVars {
  return (
    typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string'
  );
}

export function usePendingItemIds(): ReadonlySet<string> {
  const ids = useMutationState({
    filters: { mutationKey: menuKeys.mutations(), status: 'pending' },
    select: (mutation) =>
      hasItemId(mutation.state.variables) ? mutation.state.variables.id : null,
  });
  return useMemo(() => new Set(ids.filter((id): id is string => id !== null)), [ids]);
}
