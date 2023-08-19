import { useState, useRef, Dispatch, SetStateAction } from 'react';
import { NumberInput, Group, ActionIcon, NumberInputHandlers } from '@mantine/core';
import ImageAsset from './ImageAsset';

export default function NumberComp({
  label,
  value,
  setValue,
  step,
  min,
  max,
  iconId,
}: {
  label: string,
  value: number,
  setValue: (val: number) => void,
  step?: number,
  min?: number,
  max?: number,
  iconId?: string,
}) {
  const handlers = useRef<NumberInputHandlers>();
  return (
    <Group spacing={5}>
      <ActionIcon size={36} variant="default" onClick={() => handlers.current!.decrement()}>
        –
      </ActionIcon>
      <NumberInput
        hideControls
        placeholder={label}
        value={value}
        onChange={(val) => {
          if (val) {
            setValue(val)
          }
        }}
        handlersRef={handlers}
        min={min ? min : 0}
        max={max ? max : 999999}
        step={step ? step : 10000}
        error={!!!value}
        icon={iconId
          ? <div className="aspect-square w-4 h-4">
            <ImageAsset aid={iconId} aspect="1" env='local' />
          </div>
          : null
        }
        styles={{ input: { width: 100, textAlign: 'center' } }}
      />
      <ActionIcon size={36} variant="default" onClick={() => handlers.current!.increment()}>
        +
      </ActionIcon>
    </Group>
  );
}
