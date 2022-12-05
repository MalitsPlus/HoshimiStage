import { useState } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from "react-dnd-touch-backend";
import { getAllCards, getData } from "../../src/utils/datamgr";
import Kockpit from "./Kockpit";
import Lane from "./Lane";

const allCards = getData(getAllCards)
const ptCards = [allCards[1], allCards[65], allCards[34], allCards[91], allCards[45]]

function switchPosition<T>(list: T[], srcIndex: number, destIndex: number): T[] {
  const switched = list.slice()
  switched[srcIndex] = list[destIndex]
  switched[destIndex] = list[srcIndex]
  return switched
}

export default function Stage() {
  const [cards, setParty] = useState(ptCards)

  const onCharaClick = (id: string) => {
    console.log(id + "clicked")
  }

  const onCharaDrop = (src: number, dest: number) => {
    if (src === dest) {
      console.log(`same. src: ${src}, dest: ${dest}.`)
      return
    }
    console.log(`different. src: ${src}, dest: ${dest}.`)
    // Update based on previous states.
    // See https://reactjs.org/docs/hooks-reference.html#functional-updates
    setParty(previous => switchPosition(previous, src, dest))
  }

  const onChartClick = () => {
    
  }

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <div>
        <div>
          <Kockpit />
        </div>
        <div className="grid grid-cols-5 justify-items-stretch min-w-max divide-x divide-solid divide-slate-500/25">
          {cards.map((card, index) => (
            <Lane
              card={card} index={index} key={card.id}
              onCharaClick={onCharaClick}
              onCharaDrop={onCharaDrop}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  )
}
