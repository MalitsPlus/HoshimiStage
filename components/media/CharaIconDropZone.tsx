import React, { ComponentProps, useEffect } from "react"
import { useDrop } from "react-dnd"
import { ItemTypes } from "./DraggableCharaIcon"

export default function CharaIconDropZone(
  { children,
    index,
    onCharaDrop,
    ...others
  }: {
    children: React.ReactNode,
    index: number,
    onCharaDrop: (srcId: string, srcIndex: number, dest: number) => void
  } & ComponentProps<"div">
) {
  const [{ isDropped, isOver }, dropRef] = useDrop(
    () => ({
      accept: ItemTypes.CharaIcon,
      drop(item: {id: string, index: number}) {
        // const { id, index } = monitor.getItem<{ id: string, index: number }>()
        console.log(`dropping ${item.id}, id ${item.id}, to ${item.index}`)
        onCharaDrop(item.id, item.index, index)
      },
      collect: monitor => ({
        isDropped: !!monitor.didDrop(),
        isOver: !!monitor.isOver(),
      }),
    }), [index, onCharaDrop]
  )

  return (
    <div ref={dropRef} {...others}>
      {children}
    </div>
  )
}
