import React, { ComponentProps } from "react"
import { useDrop } from "react-dnd"
import { DraggableCharaIconProps, ItemTypes } from "./DraggableCharaIcon"

export default function CharaIconDropZone(
  { children,
    index,
    onCharaDrop,
    ...others
  }: {
    children: React.ReactNode,
    index: number,
    onCharaDrop: (src: number, dest: number) => void
  } & ComponentProps<"div">
) {
  const [{ isDropped, isOver }, dropRef] = useDrop(
    () => ({
      accept: ItemTypes.CharaIcon,
      drop: (item, monitor) => {
        const src = monitor.getItem<DraggableCharaIconProps>().index
        console.log(`dropping ${monitor.getItem<DraggableCharaIconProps>().aid}, index ${monitor.getItem<DraggableCharaIconProps>().index}, to ${index}`)
        onCharaDrop(src, index)
      },
      collect: monitor => ({
        isDropped: !!monitor.didDrop(),
        isOver: !!monitor.isOver(),
      }),
    }), [index]
  )
  return (
    <div ref={dropRef} {...others}>
      {children}
    </div>
  )
}
