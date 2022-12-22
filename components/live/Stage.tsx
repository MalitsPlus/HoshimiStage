import update from 'immutability-helper'
import { Modal } from "@mantine/core";
import { Card } from "hoshimi-venus/out/types/proto/proto_master";
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";
import { SetStateAction, useCallback, useMemo, useReducer, useState } from "react";
import { DndProvider } from 'react-dnd';
import { TouchBackend } from "react-dnd-touch-backend";
import { getAllCards, getData, getRawCard } from "../../src/utils/datamgr";
import CustDragLayer from "../media/CustDragLayer";
import Greenroom from "./Greenroom";
import Kockpit from "./Kockpit";
import Lane from "./Lane";
import simulate from 'hoshimi-venus';
import { isPartyFull } from '../../src/utils/misc';
import { TransDeck } from 'hoshimi-venus/out/types/trans_types';
import { getDefaultTransCard } from '../../src/utils/card_utils';
import { Live } from 'hoshimi-venus/out/types/concert_types';

const allCards = getData(getAllCards)
// const ptCards = [allCards[1], allCards[65], allCards[34], allCards[91], allCards[45]]

export type TParty = { [k: number]: { card?: Card, readonly ingamePos: number } }

const ptCards: TParty = {
  0: { card: allCards[1], ingamePos: 4 },
  1: { card: allCards[65], ingamePos: 2 },
  2: { card: allCards[34], ingamePos: 1 },
  3: { card: allCards[91], ingamePos: 3 },
  4: { card: allCards[45], ingamePos: 5 },
}

// const ptCards: TParty = {
//   0: { card: undefined, ingamePos: 4 },
//   1: { card: undefined, ingamePos: 2 },
//   2: { card: undefined, ingamePos: 1 },
//   3: { card: undefined, ingamePos: 3 },
//   4: { card: undefined, ingamePos: 5 },
// }

export default function Stage() {
  const [focusPosition, setFocusPosition] = useState<number | undefined>(undefined)
  const [party, setParty] = useState(ptCards)
  const [wapQuest, setWapQuest] = useState<WapQuest | undefined>(undefined)
  const [groomOpened, setGroomOpened] = useState(false)
  const [live, setLive] = useState<Live | undefined>(undefined)

  console.log("render stage state")

  const onCharaClick = useCallback((index: number, id?: string) => {
    setFocusPosition(index)
    setGroomOpened(true)
  }, [])

  const onSetLive = useCallback((wapQuest: SetStateAction<WapQuest | undefined>) => {
    setLive(undefined)
    setWapQuest(wapQuest)
  }, [])

  const onSetParty = useCallback((party: SetStateAction<TParty>) => {
    setLive(undefined)
    setParty(party)
  }, []) 

  const findCardIndex = useCallback((srcId: string) => {
    const src = +(Object.entries(party).find(([, v]) => v.card?.id === srcId)?.at(0) ?? -1)
    console.log(`called find card ${srcId}`)
    return src
  }, [party])

  const onCharaDrop = useCallback((srcId: string, srcIndex: number, dest: number) => {
    // if (srcIndex === dest) {
    //   console.log(`not computed, same. src: ${srcIndex}, dest: ${dest}.`)
    //   return
    // }
    const src = findCardIndex(srcId)
    if (src !== -1) {
      if (src === dest) {
        console.log(`same. src: ${src}, dest: ${dest}.`)
        return
      }
      console.log(`different. src: ${src}, dest: ${dest}.`)
      // Update based on previous states.
      // See https://reactjs.org/docs/hooks-reference.html#functional-updates
      onSetParty(previous =>
        update(previous, {
          [dest]: {
            card: { $set: previous[src].card }
          },
          [src]: {
            card: { $set: previous[dest].card }
          },
        })
      )
      setFocusPosition(undefined)
    } else {
      onSetParty(previous =>
        update(previous, {
          [dest]: {
            card: { $set: getData(getRawCard, srcId) }
          }
        })
      )
    }
  }, [findCardIndex, onSetParty])

  const onSimulateClick = () => {
    if (!wapQuest || !isPartyFull(party)) {
      console.log("unselected quest or insufficient performers")
      return
    }
    const transDeck: TransDeck = {
      name: "UserDeck",
      transCards: []
    }
    transDeck.transCards = Object.values(party).map(it => ({
      card: getDefaultTransCard(it.card!, it.ingamePos),
      index: it.ingamePos,
    }))
    const result = simulate(wapQuest?.id, transDeck)
    if (typeof result === "string") {
      console.log("simulation returns string.")
      return
    }
    setLive(result)
  }

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <div className='flex flex-col h-screen'>
        <Modal
          opened={groomOpened}
          onClose={() => setGroomOpened(false)}
          title="Edit party"
          overflow="outside"
          size="auto"
        >
          <Greenroom
            party={party}
            setParty={onSetParty}
            focusPosition={focusPosition}
            setFocusPosition={setFocusPosition}
            onCharaDrop={onCharaDrop} />
        </Modal>
        <div>
          <Kockpit wapQuest={wapQuest} setWapQuest={onSetLive} onSimulateClick={onSimulateClick} />
        </div>
        <div className="grid grid-cols-5 justify-items-stretch h-full min-w-max grow divide-x divide-solid divide-slate-500/25">
          {Object.entries(party).map(([k, v]) => (
            <Lane
              card={v.card} index={+k} key={k}
              wapQuest={wapQuest}
              live={live}
              onCharaClick={() => onCharaClick(+k, v.card?.id)}
              onCharaDrop={onCharaDrop}
            />
          ))}
        </div>
      </div>
      <CustDragLayer />
    </DndProvider>
  )
}

export const index2GamePos: {
  [index: number]: number
} = {
  0: 4,
  1: 2,
  2: 1,
  3: 3,
  4: 5,
  5: 9,
  6: 7,
  7: 6,
  8: 8,
  9: 10,
}