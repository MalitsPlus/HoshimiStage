import classNames from "classnames"
import { Live } from "hoshimi-venus/out/types/concert_types"
import { AttributeType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { useEffect, useState } from "react"
import { getChara } from "../../src/utils/datamgr"
import { getAttrBgColor, getCardAttribute } from "../../src/utils/misc"
import DraggableCharaIcon from "../media/DraggableCharaIcon"

export default function Lane({ card, index, live, onCharaClick, onDragged }: {
  card: Card, index: number, live?: Live,
  onCharaClick: (id: string) => void,
  onDragged: (source: number, destination?: number) => void,
}
) {
  const { id, assetId, type, name, characterId } = card
  const attribute = getCardAttribute(card)
  const chara = getChara(characterId)
  const _index = index as keyof typeof gameIndex2LaneIndex

  const [winReady, setWinReady] = useState(false)
  useEffect(() => {
    setWinReady(true)
  }, [])

  return (
    <div className={`flex flex-col h-screen items-center justify-start p-4 border-y-0`}>
      {winReady ?
        <DraggableCharaIcon
          cid={id}
          aid={assetId}
          role={type}
          index={index}
          attribute={attribute}
          onCharaClick={onCharaClick}
          onDragged={onDragged}
        />
        : null
      }
      <p>{chara.name}</p>
      <div className={classNames( // FIXME: color value shall be the music pattern one, not card one.
        "w-full h-0.5 rounded-sm",
        attribute === AttributeType.Dance ? "bg-dance"
          : attribute === AttributeType.Vocal ? "bg-vocal"
            : "bg-visual"
      )} />
    </div>
  )
}

const gameIndex2LaneIndex = {
  0: "order-3",
  1: "order-2",
  2: "order-4",
  3: "order-1",
  4: "order-5",
}
