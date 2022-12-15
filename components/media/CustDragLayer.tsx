import { useDragLayer } from "react-dnd"
import CharaIcon from "./CharaIcon"

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
    <div className='fixed left-0 top-0 z-[9999] opacity-100 w-full h-full pointer-events-none'>
      <div style={transform}>
        <CharaIcon id={item.id} assetId={item.assetId} role={item.type} attribute={item.attribute} />
      </div>
    </div>
  )
}

export default CustDragLayer
