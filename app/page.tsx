import { parseFilters } from '@/features/stop-list/model/filters';
import { StopListScreen } from '@/features/stop-list/ui/StopListScreen';

export default async function Page(props: PageProps<'/'>) {
  const filters = parseFilters(await props.searchParams);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Стоп-лист</h1>
        <p className="text-ink-muted mt-1">Меню смены: позиции, которые сейчас нельзя продать</p>
      </header>
      <StopListScreen filters={filters} />
    </main>
  );
}
