import { ActionIcon, Alert, CopyButton, Dialog, Modal, Overlay, Space, TextInput } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconAlertCircle, IconAnalyze, IconCheck, IconCopy } from '@tabler/icons';
import { logEvent } from 'firebase/analytics';
import { Timestamp } from 'firebase/firestore';
import simulate from 'hoshimi-venus';
import { Live } from 'hoshimi-venus/out/types/concert_types';
import { CustomNote, TransDeck } from 'hoshimi-venus/out/types/trans_types';
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";
import { t } from 'i18next';
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { DndProvider } from 'react-dnd';
import { TouchBackend } from "react-dnd-touch-backend";
import { analytics, addSimulation, auth, getSimulation, FirestoreCard, FirestoreLive } from '../../src/firebase/firebase';
import { charaDropAction } from "../../src/utils/live_utils";
import { isPartyFull } from '../../src/utils/misc';
import { createInitState, getDefaultUserData, parseUserData, stringifyUserData } from '../../src/utils/user_data';
import CustDragLayer from "../media/CustDragLayer";
import Greenroom from "./Greenroom";
import Kockpit from "./Kockpit";
import Lane from "./Lane";
import StatusPannel from './StatusPannel';
import { useRouter } from 'next/router';
import { getQuest } from 'hoshimi-venus/out/db/repository/quest_repository';
import { UserCard } from 'hoshimi-venus/out/types/card_types';
import { getUserCard } from '../../src/utils/data_mgr';
import AutoFormationPannel from './AutoFormationPannel';

let didInit = false

export type StageParty = {
  [k: number]: {
    cardId?: string,
    readonly ingamePos: number,
  },
}

const defaultParty: StageParty = {
  0: { cardId: undefined, ingamePos: 4 },
  1: { cardId: undefined, ingamePos: 2 },
  2: { cardId: undefined, ingamePos: 1 },
  3: { cardId: undefined, ingamePos: 3 },
  4: { cardId: undefined, ingamePos: 5 },
}

export default function Stage() {
  console.debug("render stage state")

  // UI states
  const [groomOpened, setGroomOpened] = useState(false)
  const [statPnlOpened, setstatPnlOpened] = useState(false)
  const [autoPnlOpened, setautoPnlOpened] = useState(false)
  const [shareModalOpened, setShareModalOpened] = useState(false)
  const [loading, setLoading] = useState(false);
  const [liveId, setLiveId] = useState<string | undefined>(undefined)
  const shareUrl = liveId ? `${location.protocol}//${location.host}${location.pathname}?t=${liveId}` : undefined
  const router = useRouter()

  // data model states
  const [live, setLive] = useState<Live | undefined>(undefined)
  const [customNotes, setCustomNotes] = useState<CustomNote[]>([])

  // persistent data
  const [userData, setUserData, cleanUserData] = useLocalStorage({
    key: "UserData",
    defaultValue: getDefaultUserData(),
    serialize: stringifyUserData,
    deserialize: parseUserData,
  })
  const [party, setParty, cleanParty] = useLocalStorage({
    key: "UserData_lastParty",
    defaultValue: defaultParty,
  })
  const [wapQuest, setWapQuest, cleanQuest] = useLocalStorage<WapQuest | undefined>({
    key: "UserData_lastQuest",
    defaultValue: undefined,
  })

  const onCharaClick = useCallback((index: number, id?: string) => {
    setGroomOpened(true)
  }, [])

  const onSetQuest = useCallback((wapQuest: WapQuest | undefined) => {
    setCustomNotes([])
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
      console.debug("unselected quest or insufficient performers")
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

    setLoading(true)
    setTimeout(() => {
      const result = simulate(wapQuest?.id, transDeck, undefined, customNotes)
      if (typeof result === "string") {
        console.debug(result)
        console.debug("Simulation failed. Perhaps there are some new ingame features those we havn't keep up to date.")
        return
      }
      setLive(result)
      setLoading(false)
      logEvent(analytics, "click_simulate")
      addSimulation(result, "").then((id) => {
        setLiveId(id)
      })
    }, 0)
  }, [userData, party, wapQuest, customNotes])

  const onStatusEditClick = useCallback(() => {
    if (!isPartyFull(party)) {
      // FIXME: pop hint
      console.debug("insufficient performers")
      return
    }
    setstatPnlOpened(true)
  }, [party])

  const onAutoFormationClick = useCallback(() => {
    if (!wapQuest) {
      console.debug("must select quest before implementing auto-formation")
      return
    }
    setautoPnlOpened(true)
  }, [wapQuest])

  const onShareClick = useCallback(() => {
    setShareModalOpened(prev => !prev)
  }, [])

  const onToggleNote = useCallback((ingamePos: number, sequence: number) => {
    console.debug(`toggle! ${ingamePos} - ${sequence}`)
    setCustomNotes(previous => {
      const oldIndex = previous.findIndex(it => it.sequence === sequence && it.ingamePos === ingamePos)
      if (oldIndex !== -1) {
        const newArray = [...previous]
        newArray.splice(oldIndex, 1)
        return newArray
      } else {
        return [
          ...previous,
          {
            ingamePos: ingamePos,
            sequence: sequence,
            privilege: "opponent",
          }
        ]
      }
    })
    setLive(undefined)
  }, [])

  useEffect(() => {
    // to avoid react renders this effect twice
    if (!didInit && router.isReady) {
      didInit = true
      let ignore = false

      let { t } = router.query
      if (t) {
        if (typeof t !== "string") {
          t = t[0]
        }
        setLiveId(t)
        setLoading(true)
        getSimulation(t).then(fsLive => {
          if (fsLive && !ignore) {
            const localParty = {
              0: { cardId: fsLive.p4.cardId, ingamePos: 4 },
              1: { cardId: fsLive.p2.cardId, ingamePos: 2 },
              2: { cardId: fsLive.p1.cardId, ingamePos: 1 },
              3: { cardId: fsLive.p3.cardId, ingamePos: 3 },
              4: { cardId: fsLive.p5.cardId, ingamePos: 5 },
            }
            const localQuest = getQuest(fsLive.quest)
            setWapQuest(localQuest)
            setParty(localParty)
            if (fsLive.customNotes) {
              setCustomNotes(fsLive.customNotes)
            }
            const localUserCards = createInitState(localParty, userData)
            const cardDict = localUserCards.reduce((acc: { [id: string]: UserCard }, cur) => {
              acc[cur!.id] = cur!
              return acc
            }, {})
            for (let i = 1; i <= 5; i++) {
              const fireCard = fsLive[`p${i}` as keyof FirestoreLive] as FirestoreCard
              cardDict[fireCard.cardId] = getUserCard({
                cardId: fireCard.cardId,
                level: 200,
                rarity: 10,
                vocal: fireCard.vocal,
                dance: fireCard.dance,
                visual: fireCard.visual,
                stamina: fireCard.stamina,
                mental: fireCard.mental,
                technique: fireCard.technique,
                skillLevel1: fireCard.s1,
                skillLevel2: fireCard.s2,
                skillLevel3: fireCard.s3,
              })
            }
            setUserData(prev => {
              return {
                ...prev,
                cards: {
                  ...prev.cards,
                  ...cardDict,
                }
              }
            })
            const transDeck: TransDeck = {
              name: "UserDeck",
              userCards: []
            }
            transDeck.userCards = Object.values(cardDict).map(uCard => ({
              card: uCard,
              index: Object.values(localParty).find(it => it.cardId === uCard.id)!.ingamePos,
            }))
            const result = simulate(fsLive.quest, transDeck, undefined, fsLive.customNotes)
            if (typeof result !== "string") {
              setLive(result)
            }
          }
        }).finally(() => {
          setLoading(false)
        })
      }
      return () => {
        ignore = true
      }
    }
  }, [router.isReady])

  // for clean test
  // useEffect(() => {
  //   cleanQuest()
  //   cleanParty()
  //   cleanUserData()
  // }, [])

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      {loading
        ? <Overlay<"div"> opacity={0.8} color="#000" zIndex={1001} className="flex flex-col justify-center items-center" >
          <IconAnalyze width={150} height={150} className="animate-spin-reverse" />
          <p className='font-mono text-xl'>simulating...</p>
        </Overlay>
        : null}
      <Modal
        opened={shareModalOpened}
        onClose={() => setShareModalOpened(false)}
        withCloseButton={false}
        radius="md"
        overlayOpacity={0.4}
        centered
      >
        {liveId ?
          <>
            <Alert icon={<IconAlertCircle size={16} />} color="indigo">
              <div className='text-base'>{t("Share desc")}</div>
              <Space h={8} />
              <div className='flex flex-row items-center gap-2'>
                <div className='grow'>
                  <TextInput value={shareUrl} readOnly size="sm" />
                </div>
                <div>
                  <CopyButton value={shareUrl ?? ""} timeout={2000}>
                    {({ copied, copy }) => (
                      <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      </ActionIcon>
                    )}
                  </CopyButton>
                </div>
              </div>
            </Alert>
          </>
          : <Alert icon={<IconAlertCircle size={16} />} title="No result here" color="red">
            <div className='text-base'>{t("Share hint")}</div>
          </Alert>
        }
      </Modal>
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
        <AutoFormationPannel
          opened={autoPnlOpened}
          setOpened={setautoPnlOpened}
          wapQuest={wapQuest}
        />
        <div>
          <Kockpit
            wapQuest={wapQuest}
            setWapQuest={onSetQuest}
            onSimulateClick={onSimulateClick}
            onStatusEditClick={onStatusEditClick}
            onShareClick={onShareClick}
            onAutoFormationClick={onAutoFormationClick}
          />
        </div>
        <div className="grid grid-cols-5 justify-items-stretch h-full min-w-max grow divide-x divide-solid divide-slate-500/25">
          {Object.entries(party).map(([k, v]) => (
            <Lane
              card={v.cardId ? userData.getCard(v.cardId) : undefined}
              index={+k}
              key={k}
              wapQuest={wapQuest}
              live={live}
              customNotes={customNotes}
              onToggleNote={onToggleNote}
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