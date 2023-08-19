import { ActionIcon, NumberInput, NumberInputHandlers, Stack } from '@mantine/core';
import { memo, useEffect, useRef } from 'react';

export default memo(function NumberCompVertical({
  value,
  setValue,
  step,
  min,
  max,
}: {
  value: number,
  setValue: (val: number) => void,
  step?: number,
  min?: number,
  max?: number,
}) {
  const handlers = useRef<NumberInputHandlers>()
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = true
    }
  }, [])
  return (
    <Stack spacing={4}>
      <ActionIcon size={18} variant="default" onClick={() => handlers.current!.increment()}>
        +
      </ActionIcon>
      <NumberInput
        hideControls
        value={value}
        onChange={(val) => {
          if (!val) {
            return
          }
          setValue(val)
        }}
        handlersRef={handlers}
        ref={inputRef}
        min={min ? min : 1}
        max={max ? max : 6}
        step={step ? step : 1}
        error={!!!value}
        styles={{
          input: {
            fontSize: 14,
            padding: 0,
            width: 18,
            height: 16,
            minWidth: 18,
            minHeight: 16,
            textAlign: 'center'
          }
        }}
      />
      <ActionIcon size={18} variant="default" onClick={() => handlers.current!.decrement()}>
        –
      </ActionIcon>
    </Stack>
  );
})
