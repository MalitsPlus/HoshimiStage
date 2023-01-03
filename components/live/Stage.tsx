import { Modal } from "@mantine/core";
import { useLocalStorage } from '@mantine/hooks';
import simulate from 'hoshimi-venus';
import { getQuest } from 'hoshimi-venus/out/db/repository/quest_repository';
import { UserCard } from 'hoshimi-venus/out/types/card_types';
import { Live } from 'hoshimi-venus/out/types/concert_types';
import { TransDeck } from 'hoshimi-venus/out/types/trans_types';
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";
import update from 'immutability-helper';
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { DndProvider } from 'react-dnd';
import { TouchBackend } from "react-dnd-touch-backend";
import { getAllCards, getData, getDefaultUserCard } from "../../src/utils/datamgr";
import { isPartyFull } from '../../src/utils/misc';
import { getDefaultUserData, parseUserData, stringifyUserData } from '../../src/utils/user_data';
import CustDragLayer from "../media/CustDragLayer";
import Greenroom from "./Greenroom";
import Kockpit from "./Kockpit";
import Lane from "./Lane";
import StatusPannel from './StatusPannel';

const allCards = getData(getAllCards)
// const ptCards = [allCards[1], allCards[65], allCards[34], allCards[91], allCards[45]]

export type AllyParty = {
  [k: number]: {
    card?: UserCard,
    readonly ingamePos: number,
  }
}

const ptCards: AllyParty = {
  0: { card: getDefaultUserCard("card-ai-03-schl-00"), ingamePos: 4 },
  1: { card: getDefaultUserCard("card-mna-05-fest-00"), ingamePos: 2 },
  2: { card: getDefaultUserCard("card-kkr-04-casl-00"), ingamePos: 1 },
  3: { card: getDefaultUserCard("card-chs-03-schl-00"), ingamePos: 3 },
  4: { card: getDefaultUserCard("card-smr-04-casl-00"), ingamePos: 5 },
}

// const ptCards: TParty = {
//   0: { card: undefined, ingamePos: 4 },
//   1: { card: undefined, ingamePos: 2 },
//   2: { card: undefined, ingamePos: 1 },
//   3: { card: undefined, ingamePos: 3 },
//   4: { card: undefined, ingamePos: 5 },
// }

export default function Stage() {
  console.log("render stage state")

  // UI states
  const [groomOpened, setGroomOpened] = useState(false)
  const [statPnlOpened, setstatPnlOpened] = useState(false)

  // data model states
  const [focusPosition, setFocusPosition] = useState<number | undefined>(undefined)
  const [party, setParty] = useState(ptCards)
  const [wapQuest, setWapQuest] = useState<WapQuest | undefined>(undefined)
  const [live, setLive] = useState<Live | undefined>(undefined)

  // persistent data
  const [userData, setUserData] = useLocalStorage({
    key: "UserData",
    defaultValue: getDefaultUserData(),
    serialize: stringifyUserData,
    deserialize: parseUserData,
  })
  const [lastQuest, setLastQuest] = useLocalStorage<string | undefined>({
    key: "UserData_lastQuest",
    defaultValue: undefined,
  })
  const [lastDeck, setLastDeck] = useLocalStorage<string | undefined>({
    key: "UserData_lastDeck",
    defaultValue: undefined,
  })

  const onCharaClick = useCallback((index: number, id?: string) => {
    setFocusPosition(index)
    setGroomOpened(true)
  }, [])

  const onSetQuest = useCallback((wapQuest: SetStateAction<WapQuest | undefined>) => {
    setLive(undefined)
    setWapQuest(wapQuest)
  }, [])

  const onSetParty = useCallback((party: SetStateAction<AllyParty>) => {
    setLive(undefined)
    setParty(party)
  }, [])

  const findCardIndex = useCallback((srcId: string) => {
    const src = +(Object.entries(party).find(([, v]) => v.card?.id === srcId)?.at(0) ?? -1)
    console.log(`called find card ${srcId}`)
    return src
  }, [party])

  const onCharaDrop = useCallback((srcId: string, srcIndex: number, dest: number) => {
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
            card: { $set: userData.getCard(srcId) }
          }
        })
      )
    }
  }, [userData, findCardIndex, onSetParty])

  const onSimulateClick = useCallback(() => {
    if (!wapQuest || !isPartyFull(party)) {
      // FIXME: pop hint
      console.log("unselected quest or insufficient performers")
      return
    }
    const transDeck: TransDeck = {
      name: "UserDeck",
      userCards: []
    }
    transDeck.userCards = Object.values(party).map(it => ({
      card: it.card!,
      index: it.ingamePos,
    }))
    const result = simulate(wapQuest?.id, transDeck)
    if (typeof result === "string") {
      console.log("simulation returns string.")
      return
    }
    setLive(result)
  }, [party, wapQuest])

  const onStatusEditClick = useCallback(() => {
    if (!isPartyFull(party)) {
      // FIXME: pop hint
      console.log("insufficient performers")
      return
    }
    setstatPnlOpened(true)
  }, [party])

  // retrieve last scene at first render
  useEffect(() => {
    if (lastQuest) {
      const wapQuest = getQuest(lastQuest)
      onSetQuest(wapQuest)
    }
    if (lastDeck) {
      const deck = userData.getDeck(lastDeck)
      if (deck) {
        const lastParty = {
          0: { card: userData.getCard(deck.party[0]), ingamePos: 4 },
          1: { card: userData.getCard(deck.party[1]), ingamePos: 2 },
          2: { card: userData.getCard(deck.party[2]), ingamePos: 1 },
          3: { card: userData.getCard(deck.party[3]), ingamePos: 3 },
          4: { card: userData.getCard(deck.party[4]), ingamePos: 5 },
        }
        onSetParty(lastParty)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <Modal
          opened={statPnlOpened}
          onClose={() => setstatPnlOpened(false)}
          title="Edit status"
          overflow="outside"
          size="auto"
        >
          <StatusPannel
            party={party}
            setParty={onSetParty}
          />
        </Modal>
        <div>
          <Kockpit
            wapQuest={wapQuest}
            setWapQuest={onSetQuest}
            onSimulateClick={onSimulateClick}
            onStatusEditClick={onStatusEditClick}
          />
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