'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

let browserQueryClient: QueryClient | undefined;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 5_000, refetchOnWindowFocus: false },
    },
  });
}

function getQueryClient() {
  if (typeof window === 'undefined') return createQueryClient();
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
