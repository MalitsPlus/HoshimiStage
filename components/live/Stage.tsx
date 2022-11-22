import { useListState } from "@mantine/hooks";
import { Card } from "hoshimi-venus/out/types/proto/proto_master";
import { DragDropContext } from "react-beautiful-dnd";
import { getAllCards, getData } from "../../src/utils/datamgr";
import Lane from "./Lane"

const cards = getData(getAllCards)
const ptCards = [cards[1], cards[65], cards[34], cards[91], cards[45]]

export default function Stage() {
  const [cards, handlers] = useListState(ptCards)

  const onDragged = (source: number, destination?: number) => {
    console.log(`source: ${source} to des: ${destination}`)
    if (destination) {
      handlers.reorder({ from: source, to: destination })
    }
    // handlers.reorder({ from: source, to: destination || 0 })
  }

  const onCharaClick = (id: string) => {
    console.log(id + "clicked")
    // handlers.reorder({from: 0, to: 1})
  }
  return (
    <DragDropContext
      onDragEnd={({ source, destination }) => {
        onDragged(source.index, destination?.index)
      }}
    >
      <div className="grid grid-cols-5 justify-items-stretch min-w-max divide-x divide-solid divide-slate-500/25">
        {cards.map((card, index) => (
          <Lane
            card={card} index={index} key={card.id}
            onCharaClick={onCharaClick}
            onDragged={onDragged}
          />
        ))}
      </div>
    </DragDropContext>
  )
}
