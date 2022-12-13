import classNames from 'classnames';
import { Card } from 'hoshimi-venus/out/types/proto/proto_master';
import { useEffect } from 'react';
import { useDrag } from "react-dnd";
import { getEmptyImage } from 'react-dnd-html5-backend';
import { getCardAttribute } from '../../src/utils/misc';
import CharaIcon from './CharaIcon';

export const ItemTypes = {
  CharaIcon: "charaIcon"
}

export type DraggableCharaIconProps = {
  card?: Card,
  index: number,
  canDrag: boolean,
  onCharaClick?: () => void
}

export default function DraggableCharaIcon({
  card, index, canDrag, onCharaClick,
}: DraggableCharaIconProps) {

  const { id, assetId, type } = card ?? {
    id: undefined,
    assetId: undefined,
    type: undefined
  }
  const attribute = card ? getCardAttribute(card) : undefined

  const [{ isDragging }, dragRef, dragPreview] = useDrag(() => ({
    type: ItemTypes.CharaIcon,
    item: { id, assetId, index, type, attribute },
    canDrag: canDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  }), [id, assetId, index, type, attribute, canDrag])
  // deps are used to evaluate memoized inputs change.
  // In a short word, when deps are the same as their previous values, function will not be performed and directly
  // returns the same values as the previous results. 

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true })
    if (isDragging) {
      document.body.classList.add("dragging")
    } else {
      document.body.classList.remove("dragging")
    }
  }, [isDragging])

  return (
    <>
      <div ref={dragRef} className={classNames(
        isDragging ? "shadow opacity-0 pointer-events-none" : "opacity-100",
        canDrag ? "" : "[filter:brightness(0.5)]",
      )}>
        <CharaIcon id={id} assetId={assetId} role={type} attribute={attribute} onCharaClick={canDrag ? onCharaClick : undefined} />
      </div>
    </>
  )
}
 