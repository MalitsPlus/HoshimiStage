import { Modal, NumberInput } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { UserCard } from "hoshimi-venus/out/types/card_types"
import { AttributeType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { WapCard } from "hoshimi-venus/out/types/wap/card_waps"
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useReducer, useState } from "react"
import { getChara, getData } from "../../src/utils/datamgr"
import { getCardAttribute, isPartyFull } from "../../src/utils/misc"
import { UserData } from "../../src/utils/user_data"
import CharaIcon from "../media/CharaIcon"
import NumberComp from "../misc/NumberComp"
import { StageParty } from "./Stage"
import update from 'immutability-helper'
import { getCardParameter, getCardRarity } from "hoshimi-venus/out/db/repository/card_repository"
import { calcParam } from "hoshimi-venus/out/utils/calc_utils";

function reducer(
  state: UserCard,
  action: Partial<UserCard> & { rtype: string }
): UserCard {
  return update(state, {

  })
  switch (action.rtype) {
    case "dance":
      return {
        ...state,
        dance: action.dance!,
      }
    case "vocal":
      return {
        ...state,
        vocal: action.vocal!,
      }
    case "visual":
      return {
        ...state,
        visual: action.visual!,
      }
  }
  return state
}

const StatusCard = memo(function _StatusCard({
  uiPos,
  userCard,
  setUserCard,
}: {
  uiPos: number,
  userCard: UserCard,
  setUserCard: (userCard: UserCard, uiPos: number) => void,
}) {
  const attribute = getCardAttribute(userCard)
  const chara = getData(getChara, userCard.characterId)

  // const [dance, setDance] = useState(card.dance)

  const getSetFunction = (type: string): (_: number) => void => {
    return (newValue: number) => {
      const newCard = {
        ...userCard,
        [type]: newValue,
      }
      setUserCard(newCard, uiPos)
    }
    // return (newValue: number) => {
    //   const newCard = update(userCard, {
    //     [type]: { $set: newValue }
    //   })
    //   setUserCard(newCard, uiPos)
    // }
  }

  // const [visual, setDance] = useLocalStorage({ key: `${card.id}-visual`, defaultValue: 0 })
  // const [dance, setDance] = useLocalStorage({ key: `${card.id}-dance`, defaultValue: 0 })
  // const [dance, setDance] = useLocalStorage({ key: `${card.id}-dance`, defaultValue: 0 })

  return (
    <>
      <div className="flex flex-col items-center justify-start">
        <div>
          <CharaIcon id={userCard.id} assetId={userCard.assetId} role={userCard.type} attribute={attribute} pointer={false} />
        </div>
        <div className="my-2 text-center">{chara?.name ?? "unselected"}</div>
        <NumberComp value={userCard.dance} setValue={getSetFunction("dance")} />
        <NumberComp value={userCard.vocal} setValue={getSetFunction("vocal")} />
      </div>
    </>
  )
})

const createInitState = (
  party: StageParty,
  userData: UserData,
): (UserCard | undefined)[] => {
  return Object.entries(party).map(([uiPos, partycard]) => {
    return partycard.cardId ? userData.getCard(partycard.cardId) : undefined
  })
}

const StatusPannel = ({
  initParty,
  userData,
  setUserData,
  opened,
  setOpened,
}: {
  initParty: StageParty,
  userData: UserData,
  setUserData: (val: UserData | ((prevState: UserData) => UserData)) => void,
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>,
}) => {

  // const [state, dispatch] = useReducer(reducer, [initParty, userData], createInitState)
  const [localCards, setLocalCards] = useState(createInitState(initParty, userData))

  const setUserCard = useCallback((userCard: UserCard, uiPos: number) => {
    setLocalCards(prev => {
      return update(prev, {
        [uiPos]: { $set: userCard }
      })
    })
  }, [])

  useEffect(() => {
    setLocalCards(createInitState(initParty, userData))
    console.log("running statuspannel effect")
    // dispatch({ state: createInitState(initParty, userData), type: "all" })
  }, [initParty, userData])

  console.log("rendering StatusPannel")

  const onClose = () => {
    if (localCards.every(it => it !== undefined)) {
      setUserData(prev => {
        return {
          ...prev,
          cards: {
            ...prev.cards,
            [localCards[0]!.id]: localCards[0]!,
            [localCards[1]!.id]: localCards[1]!,
            [localCards[2]!.id]: localCards[2]!,
            [localCards[3]!.id]: localCards[3]!,
            [localCards[4]!.id]: localCards[4]!,
          }
        }
      })
    }
    setOpened(false)
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit status"
      overflow="outside"
      size="auto"
    >
      <div className="grid grid-cols-5 divide-x divide-solid divide-slate-500/25">
        {localCards.map((it, idx) => {
          return (it
            ? <StatusCard
              key={idx}
              uiPos={idx}
              userCard={it}
              setUserCard={setUserCard}
            />
            : null
          )
        })}
      </div>
    </Modal>
  )
}

export default memo(StatusPannel)
