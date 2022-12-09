import { AttributeType, CardType } from 'hoshimi-venus/out/types/proto/proto_enum';
import { useEffect } from 'react';
import { useDrag, useDragLayer } from "react-dnd";
import CharaIcon from './CharaIcon';
import { getEmptyImage } from 'react-dnd-html5-backend'

export const ItemTypes = {
  CharaIcon: "charaIcon"
}

export type DraggableCharaIconProps = {
  cid: string,
  aid: string,
  index: number,
  role: CardType,
  attribute: AttributeType,
}

export default function DraggableCharaIcon({ cid, aid, index, role, attribute, onCharaClick }: {
  onCharaClick: (id: string) => void,
} & DraggableCharaIconProps) {
  const [{ isDragging }, dragRef, dragPreview] = useDrag(() => ({
    type: ItemTypes.CharaIcon,
    item: { cid, aid, index, role, attribute },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  }), [cid, aid, index, role, attribute])
  // deps are used to evaluate memoized inputs change.
  // In a short word, when deps are the same as their previous values, function will not be performed and directly
  // returns the same values as the previous results. 

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  return (
    <>
      <div ref={dragRef} className={isDragging ? "shadow opacity-0 !cursor-grabbing" : "opacity-100"}>
        <CharaIcon cid={cid} aid={aid} role={role} attribute={attribute} onCharaClick={onCharaClick} />
      </div>
    </>
  )
}
