import { useState, useRef, Dispatch, SetStateAction } from 'react';
import { NumberInput, Group, ActionIcon, NumberInputHandlers } from '@mantine/core';

export default function NumberComp({
  value,
  setValue,
}: {
  value: number
  setValue: Dispatch<SetStateAction<number>>
}) {
  const handlers = useRef<NumberInputHandlers>();
  return (
    <Group spacing={5}>
      <ActionIcon size={36} variant="default" onClick={() => handlers.current!.decrement()}>
        –
      </ActionIcon>

      <NumberInput
        hideControls
        placeholder="Dance Parameter"
        value={value}
        onChange={(val) => setValue(val!)}
        handlersRef={handlers}
        min={0}
        step={10000}
        styles={{ input: { width: 74, textAlign: 'center' } }}
      />

      <ActionIcon size={36} variant="default" onClick={() => handlers.current!.increment()}>
        +
      </ActionIcon>
    </Group>
  );
}
