import { Modal } from "@mantine/core";
import { useLocalStorage } from '@mantine/hooks';
import simulate from 'hoshimi-venus';
import { Live } from 'hoshimi-venus/out/types/concert_types';
import { TransDeck } from 'hoshimi-venus/out/types/trans_types';
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { DndProvider } from 'react-dnd';
import { TouchBackend } from "react-dnd-touch-backend";
import { charaDropAction } from "../../src/utils/live_utils";
import { isPartyFull } from '../../src/utils/misc';
import { getDefaultUserData, parseUserData, stringifyUserData } from '../../src/utils/user_data';
import CustDragLayer from "../media/CustDragLayer";
import Greenroom from "./Greenroom";
import Kockpit from "./Kockpit";
import Lane from "./Lane";
import StatusPannel from './StatusPannel';

export type StageParty = {
  [k: number]: {
    cardId?: string,
    readonly ingamePos: number,
  }
}
// const testPtCards: StageParty = {
//   0: { cardId: "card-ai-03-schl-00", ingamePos: 4 },
//   1: { cardId: "card-mna-05-fest-00", ingamePos: 2 },
//   2: { cardId: "card-kkr-04-casl-00", ingamePos: 1 },
//   3: { cardId: "card-chs-03-schl-00", ingamePos: 3 },
//   4: { cardId: "card-smr-04-casl-00", ingamePos: 5 },
// }
const testPtCards: StageParty = {
  0: { cardId: undefined, ingamePos: 4 },
  1: { cardId: undefined, ingamePos: 2 },
  2: { cardId: undefined, ingamePos: 1 },
  3: { cardId: undefined, ingamePos: 3 },
  4: { cardId: undefined, ingamePos: 5 },
}

export default function Stage() {
  console.log("render stage state")

  // UI states
  const [groomOpened, setGroomOpened] = useState(false)
  const [statPnlOpened, setstatPnlOpened] = useState(false)

  // data model states
  const [live, setLive] = useState<Live | undefined>(undefined)

  // persistent data
  const [userData, setUserData, cleanUserData] = useLocalStorage({
    key: "UserData",
    defaultValue: getDefaultUserData(),
    serialize: stringifyUserData,
    deserialize: parseUserData,
  })
  const [party, setParty, cleanParty] = useLocalStorage({
    key: "UserData_lastParty",
    defaultValue: testPtCards,
  })
  const [wapQuest, setWapQuest, cleanQuest] = useLocalStorage<WapQuest | undefined>({
    key: "UserData_lastQuest",
    defaultValue: undefined,
  })

  const onCharaClick = useCallback((index: number, id?: string) => {
    setGroomOpened(true)
  }, [])

  const onSetQuest = useCallback((wapQuest: WapQuest | undefined) => {
    setLive(undefined)
    setWapQuest(wapQuest)
  }, [])

  const onSetParty = useCallback((
    party: SetStateAction<StageParty>,
    cleanLive: boolean = true
  ) => {
    if (cleanLive) {
      setLive(undefined)
    }
    setParty(party)
  }, [])

  const onCharaDrop = useCallback((srcId: string, dest: number) => {
    const newParty = charaDropAction(srcId, dest, party)
    if (newParty === undefined) {
      return
    }
    onSetParty(newParty, true)
  }, [party, onSetParty])

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
      card: userData.getCard(it.cardId!),
      index: it.ingamePos,
    }))
    const result = simulate(wapQuest?.id, transDeck)
    if (typeof result === "string") {
      console.log("simulation returns string.")
      return
    }
    setLive(result)
  }, [userData, party, wapQuest])

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
    // if (lastQuest) {
    //   const wapQuest = getQuest(lastQuest)
    //   onSetQuest(wapQuest)
    // }
    // if (lastDeck) {
    //   const deck = userData.getDeck(lastDeck)
    //   if (deck) {
    //     const lastParty = {
    //       0: { card: userData.getCard(deck.party[0]), ingamePos: 4 },
    //       1: { card: userData.getCard(deck.party[1]), ingamePos: 2 },
    //       2: { card: userData.getCard(deck.party[2]), ingamePos: 1 },
    //       3: { card: userData.getCard(deck.party[3]), ingamePos: 3 },
    //       4: { card: userData.getCard(deck.party[4]), ingamePos: 5 },
    //     }
    //     onSetParty(lastParty)
    //   }
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <div className='flex flex-col h-screen'>
        <Greenroom
          opened={groomOpened}
          setOpened={setGroomOpened}
          initParty={party}
          onSetParty={onSetParty}
        />
        <StatusPannel
          opened={statPnlOpened}
          setOpened={setstatPnlOpened}
          initParty={party}
          userData={userData}
          setUserData={setUserData}
        />
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
              card={v.cardId ? userData.getCard(v.cardId) : undefined} index={+k} key={k}
              wapQuest={wapQuest}
              live={live}
              onCharaClick={() => onCharaClick(+k, v.cardId)}
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