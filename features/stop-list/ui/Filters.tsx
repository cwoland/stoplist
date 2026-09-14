'use client';

import { Button } from '@/shared/ui/Button';
import { Select, type SelectOption } from '@/shared/ui/Select';
import {
  hasActiveFilters,
  SHOP_LABELS,
  SHOPS,
  STATUS_KINDS,
  STATUS_LABELS,
  updateFilter,
  type StopListFilters,
} from '../model/filters';

interface FiltersProps {
  value: StopListFilters;
  onChange: (next: StopListFilters) => void;
}

const SHOP_OPTIONS: SelectOption[] = SHOPS.map((shop) => ({
  value: shop,
  label: SHOP_LABELS[shop],
}));
const STATUS_OPTIONS: SelectOption[] = STATUS_KINDS.map((kind) => ({
  value: kind,
  label: STATUS_LABELS[kind],
}));

export function Filters({ value, onChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Цех
        <Select
          className="w-48"
          placeholder="Все цеха"
          options={SHOP_OPTIONS}
          value={value.shop ?? ''}
          onChange={(event) => onChange(updateFilter(value, 'shop', event.target.value))}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Статус
        <Select
          className="w-48"
          placeholder="Все статусы"
          options={STATUS_OPTIONS}
          value={value.status ?? ''}
          onChange={(event) => onChange(updateFilter(value, 'status', event.target.value))}
        />
      </label>
      {hasActiveFilters(value) && (
        <Button variant="ghost" onClick={() => onChange({})}>
          Сбросить
        </Button>
      )}
    </div>
  );
}
