import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/api/api-error';
import { useToastStore } from '@/shared/ui/toast-store';
import type { MenuItem, MenuItemStatus, StopItemPayload } from '@/types/menu';
import { stopMenuItem } from '../api/menu-api';
import { menuKeys } from './queries';
import { useStopItem } from './use-stop-item';

vi.mock('../api/menu-api');

const item: MenuItem = {
  id: 'k-1',
  title: 'Борщ с говядиной',
  shop: 'kitchen',
  stock: 24,
  status: { kind: 'available' },
  updatedAt: '2026-09-14T09:00:00.000Z',
};

const payload: StopItemPayload = { reason: 'equipment', until: null };

const listKeys = [menuKeys.list({}), menuKeys.list({ shop: 'kitchen' })];

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function renderStopItem() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  for (const key of listKeys) qc.setQueryData<MenuItem[]>(key, [item]);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(() => useStopItem(), { wrapper });

  const statuses = () => listKeys.map((key) => qc.getQueryData<MenuItem[]>(key)?.[0]?.status);
  return { result, statuses };
}

describe('useStopItem', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('меняет статус во всех списках сразу и сохраняет его после ответа сервера', async () => {
    const response = deferred<MenuItem>();
    vi.mocked(stopMenuItem).mockReturnValueOnce(response.promise);
    const { result, statuses } = renderStopItem();

    act(() => result.current.mutate({ id: item.id, payload }));

    const stopped: MenuItemStatus = { kind: 'stopped', ...payload };
    await waitFor(() => expect(statuses()).toEqual([stopped, stopped]));
    expect(result.current.isPending).toBe(true);
    expect(stopMenuItem).toHaveBeenCalledWith(item.id, payload);

    response.resolve({ ...item, status: stopped });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(statuses()).toEqual([stopped, stopped]);
  });

  it('откатывает статус и показывает тост, если сервер вернул ошибку', async () => {
    const response = deferred<MenuItem>();
    vi.mocked(stopMenuItem).mockReturnValueOnce(response.promise);
    const { result, statuses } = renderStopItem();

    act(() => result.current.mutate({ id: item.id, payload }));
    await waitFor(() => expect(statuses()[0]).toEqual({ kind: 'stopped', ...payload }));

    response.reject(new ApiError(500, 'Сервер не ответил'));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(statuses()).toEqual([item.status, item.status]);
    expect(useToastStore.getState().toasts).toEqual([
      expect.objectContaining({ tone: 'error', message: 'Сервер не ответил' }),
    ]);
  });
});