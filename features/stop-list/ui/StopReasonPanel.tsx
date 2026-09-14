'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/shared/ui/Button';
import { Field, fieldErrorId } from '@/shared/ui/Field';
import { Input } from '@/shared/ui/Input';
import { Select, type SelectOption } from '@/shared/ui/Select';
import type { MenuItem, StopItemPayload } from '@/types/menu';
import {
  getStopItemFormDefaults,
  getUntilBounds,
  stopItemFormSchema,
  type StopItemFormInput,
  type StopItemFormOutput,
} from '../model/stop-item-form';
import { STOP_REASON_LABELS, STOP_REASONS } from '../model/stop-item-schema';
import type { StopPanelMode } from '../model/stop-panel-store';

interface StopReasonPanelProps {
  item: MenuItem | null;
  mode: StopPanelMode;
  isSubmitting: boolean;
  onSubmit: (payload: StopItemPayload) => void;
  onClose: () => void;
}

const TITLES: Record<StopPanelMode, string> = {
  create: 'Поставить в стоп-лист',
  edit: 'Изменить причину и срок',
};

export function StopReasonPanel({
  item,
  mode,
  isSubmitting,
  onSubmit,
  onClose,
}: StopReasonPanelProps) {
  const isOpen = item !== null;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            key="backdrop"
            className="bg-ink/20 fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stop-panel-title"
            className="border-line bg-surface fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            <header className="border-line flex items-start justify-between gap-4 border-b px-6 py-5">
              <div>
                <h2 id="stop-panel-title" className="text-lg font-semibold">
                  {TITLES[mode]}
                </h2>
                <p className="text-ink-muted mt-0.5 text-sm">{item.title}</p>
              </div>
              <Button
                variant="ghost"
                aria-label="Закрыть панель"
                onClick={onClose}
                className="-mr-2 px-2"
              >
                ✕
              </Button>
            </header>
            <StopReasonForm
              key={item.id}
              item={item}
              mode={mode}
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
              onCancel={onClose}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

interface StopReasonFormProps {
  item: MenuItem;
  mode: StopPanelMode;
  isSubmitting: boolean;
  onSubmit: (payload: StopItemPayload) => void;
  onCancel: () => void;
}

const REASON_OPTIONS: SelectOption[] = STOP_REASONS.map((reason) => ({
  value: reason,
  label: STOP_REASON_LABELS[reason],
}));

function StopReasonForm({ item, mode, isSubmitting, onSubmit, onCancel }: StopReasonFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StopItemFormInput, unknown, StopItemFormOutput>({
    resolver: zodResolver(stopItemFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: getStopItemFormDefaults(item),
  });

  const untilMode = useWatch({ control, name: 'until.mode' });
  const untilBounds = useMemo(() => getUntilBounds(), []);
  const timeError = errors.until?.time?.message;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-1 flex-col gap-6 px-6 py-5"
    >
      <Field label="Причина" htmlFor="stop-reason" error={errors.reason?.message}>
        <Select
          id="stop-reason"
          autoFocus
          placeholder="Выберите причину"
          options={REASON_OPTIONS}
          invalid={Boolean(errors.reason)}
          aria-describedby={errors.reason ? fieldErrorId('stop-reason') : undefined}
          {...register('reason')}
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium">Срок</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" value="shift" className="accent-accent" {...register('until.mode')} />
          До конца смены
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" value="time" className="accent-accent" {...register('until.mode')} />
          До конкретного времени
        </label>
      </fieldset>

      {untilMode === 'time' && (
        <Field
          label="Время"
          htmlFor="stop-until"
          error={timeError}
          hint="В будущем, не позже чем через 24 часа, шаг 15 минут"
        >
          <Input
            id="stop-until"
            type="datetime-local"
            step={900}
            min={untilBounds.min}
            max={untilBounds.max}
            invalid={Boolean(timeError)}
            aria-describedby={timeError ? fieldErrorId('stop-until') : undefined}
            {...register('until.time')}
          />
        </Field>
      )}

      <div className="mt-auto flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Отмена
        </Button>
        <Button type="submit" loading={isSubmitting} loadingText="Сохраняем…">
          {mode === 'edit' ? 'Сохранить' : 'Поставить в стоп'}
        </Button>
      </div>
    </form>
  );
}
