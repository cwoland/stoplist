import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { filtersToSearch, type StopListFilters } from './filters';

export function useSetFilters() {
  const router = useRouter();
  return useCallback(
    (next: StopListFilters) => router.push(`/${filtersToSearch(next)}`, { scroll: false }),
    [router],
  );
}
