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
  }, [dragPreview])

  return (
    <>
      <div ref={dragRef} className={isDragging ? "shadow opacity-0 !cursor-grabbing" : "opacity-100"}>
        <CharaIcon cid={cid} aid={aid} role={role} attribute={attribute} onCharaClick={onCharaClick} />
      </div>
      <div >
        <CustDragLayer />
      </div>
    </>
  )
}

const CustDragLayer = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }))

  if (!isDragging) {
    return null
  }

  if (!initialOffset || !currentOffset) {
    return null
  }

  const { x, y } = currentOffset
  const transform = {
    transform: `translate(${x}px, ${y}px)`
  }

  return (
    <div className='fixed left-0 top-0 z-50 opacity-100 w-full h-full pointer-events-none !cursor-grabbing'>
      <div style={transform}>
        <CharaIcon cid={item.cid} aid={item.aid} role={item.role} attribute={item.attribute} />
      </div>
    </div>
  )
}
