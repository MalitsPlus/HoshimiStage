import React, { ComponentProps, useEffect } from "react"
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
    onCharaDrop: (srcId: string, dest: number) => void
  } & ComponentProps<"div">
) {
  const [{ isDropped, isOver }, dropRef] = useDrop(
    () => ({
      accept: ItemTypes.CharaIcon,
      drop: (item, monitor) => {
        const cid = monitor.getItem<DraggableCharaIconProps>().cid
        console.log(`dropping ${monitor.getItem<DraggableCharaIconProps>().aid}, cid ${monitor.getItem<DraggableCharaIconProps>().cid}, to ${index}`)
        onCharaDrop(cid, index)
      },
      collect: monitor => ({
        isDropped: !!monitor.didDrop(),
        isOver: !!monitor.isOver(),
      }),
    }), [index, onCharaDrop]
  )

  // useEffect(() => {
  //   if (isOver) {
  //     document.body.classList.add("hovering")
  //   } else {
  //     document.body.classList.remove("hovering")
  //   }
  // }, [isOver])

  return (
    <div ref={dropRef} {...others}>
      {children}
    </div>
  )
}
