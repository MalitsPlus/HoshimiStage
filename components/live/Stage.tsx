import { Modal } from "@mantine/core";
import { Card } from "hoshimi-venus/out/types/proto/proto_master";
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";
import { useReducer, useState } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { getAllCards, getData, getRawCard } from "../../src/utils/datamgr";
import CustDragLayer from "../media/CustDragLayer";
import Greenroom from "./Greenroom";
import Kockpit from "./Kockpit";
import Lane from "./Lane";

const allCards = getData(getAllCards)
// const ptCards = [allCards[1], allCards[65], allCards[34], allCards[91], allCards[45]]

export type TParty = { [k: number]: { card: Card, ingamePos: number } }

const ptCards: TParty = {
  0: { card: allCards[1], ingamePos: 4 },
  1: { card: allCards[65], ingamePos: 2 },
  2: { card: allCards[34], ingamePos: 1 },
  3: { card: allCards[91], ingamePos: 3 },
  4: { card: allCards[45], ingamePos: 5 },
}

function switchPosition(prev: TParty, srcIndex: number, destIndex: number): TParty {
  const switched = { ...prev }
  switched[srcIndex] = prev[destIndex]
  switched[destIndex] = prev[srcIndex]
  return switched
}

export default function Stage() {
  const [focusPosition, setFocusPosition] = useState<number | undefined>(undefined)
  const [party, setParty] = useState(ptCards)
  const [wapQuest, setWapQuest] = useState<WapQuest | undefined>(undefined)
  const [groomOpened, setGroomOpened] = useState(false)

  console.log("render stage state")

  const onCharaClick = (id: string, index: number) => {
    console.log(id + "clicked")
    setFocusPosition(index)
    console.log("focusPosition: " + focusPosition)
    setGroomOpened(true)
  }

  const onCharaDrop = (srcId: string, dest: number) => {
    const src = +(Object.entries(party).find(([, v]) => v.card.id === srcId)?.at(0) ?? -1)
    if (src !== -1) {
      if (src === dest) {
        console.log(`same. src: ${src}, dest: ${dest}.`)
        return
      }
      console.log(`different. src: ${src}, dest: ${dest}.`)
      // Update based on previous states.
      // See https://reactjs.org/docs/hooks-reference.html#functional-updates
      setParty(previous => switchPosition(previous, src, dest))
    } else {
      const newParty = { ...party }
      newParty[dest] = { ...newParty[dest], card: getData(getRawCard, srcId) }
      setParty(newParty)
    }
  }

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <div>
        <Modal
          opened={groomOpened}
          onClose={() => setGroomOpened(false)}
          title="Edit party"
          overflow="outside"
          size="auto"
        >
          <Greenroom party={party} setParty={setParty} focusPosition={focusPosition} onCharaDrop={onCharaDrop} />
        </Modal>
        <div>
          <Kockpit wapQuest={wapQuest} setWapQuest={setWapQuest} />
        </div>
        <div className="grid grid-cols-5 justify-items-stretch min-w-max divide-x divide-solid divide-slate-500/25">
          {Object.entries(party).map(([k, v]) => (
            <Lane
              card={v.card} index={+k} key={v.card.id}
              onCharaClick={() => onCharaClick(v.card.id, +k)}
              onCharaDrop={onCharaDrop}
            />
          ))}
        </div>
      </div>
      <CustDragLayer />
    </DndProvider>
  )
}
