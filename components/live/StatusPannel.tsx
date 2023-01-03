import { NumberInput } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { UserCard } from "hoshimi-venus/out/types/card_types"
import { AttributeType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { WapCard } from "hoshimi-venus/out/types/wap/card_waps"
import { memo, SetStateAction, useReducer, useState } from "react"
import { getChara, getData } from "../../src/utils/datamgr"
import { getCardAttribute } from "../../src/utils/misc"
import CharaIcon from "../media/CharaIcon"
import NumberComp from "../misc/NumberComp"
import { AllyParty } from "./Stage"

type TState = {
  dance: number,
  vocal: number,
  visual: number,
}

function reducer(
  state: TState,
  action: Partial<TState & { type: string }>
): TState {
  switch (action.type) {
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
  card
}: {
  card: UserCard
}) {
  const attribute = getCardAttribute(card)
  const chara = getData(getChara, card.characterId)

  const [dance, setDance] = useLocalStorage({ key: `${card.id}-dance`, defaultValue: card.dance })
  const [vocal, setVocal] = useLocalStorage({ key: `${card.id}-vocal`, defaultValue: 0 })
  // const [visual, setDance] = useLocalStorage({ key: `${card.id}-visual`, defaultValue: 0 })
  // const [dance, setDance] = useLocalStorage({ key: `${card.id}-dance`, defaultValue: 0 })
  // const [dance, setDance] = useLocalStorage({ key: `${card.id}-dance`, defaultValue: 0 })

  return (
    <>
      <div className="flex flex-col items-center justify-start">
        <div>
          <CharaIcon id={card.id} assetId={card.assetId} role={card.type} attribute={attribute} />
        </div>
        <div className="my-2 text-center">{chara?.name ?? "unselected"}</div>
        <NumberComp value={dance} setValue={setDance} />
      </div>
    </>
  )
})

const StatusPannel = ({
  party,
  setParty,
}: {
  party: AllyParty,
  setParty: (pt: SetStateAction<AllyParty>) => void,
}) => {

  return (
    <>
      <div className="grid grid-cols-5 divide-x divide-solid divide-slate-500/25">
        {Object.values(party).map(it => {
          return (
            it.card
              ? <StatusCard
                key={it.card?.id}
                card={it.card} />
              : null
          )
        })}
      </div>
    </>
  )
}

export default memo(StatusPannel)
