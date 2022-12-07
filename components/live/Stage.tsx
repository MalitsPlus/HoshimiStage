import { Modal } from "@mantine/core";
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";
import { useState } from "react";
import { DndProvider } from 'react-dnd';
import { TouchBackend } from "react-dnd-touch-backend";
import { getAllCards, getData } from "../../src/utils/datamgr";
import Greenroom from "./Greenroom";
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
  const [party, setParty] = useState(ptCards)
  const [wapQuest, setWapQuest] = useState<WapQuest | undefined>(undefined)
  const [groomOpened, setGroomOpened] = useState(false)

  const onCharaClick = (id: string) => {
    console.log(id + "clicked")
    setGroomOpened(true)
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

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <div>
        <Modal
          opened={groomOpened}
          onClose={() => setGroomOpened(false)}
          title="Edit party"
          size="xl"
        >
          <Greenroom party={party} setParty={setParty} />
        </Modal>
        <div>
          <Kockpit wapQuest={wapQuest} setWapQuest={setWapQuest} />
        </div>
        <div className="grid grid-cols-5 justify-items-stretch min-w-max divide-x divide-solid divide-slate-500/25">
          {party.map((card, index) => (
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
