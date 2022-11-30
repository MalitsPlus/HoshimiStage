import classNames from "classnames"
import { Live } from "hoshimi-venus/out/types/concert_types"
import { AttributeType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { getChara } from "../../src/utils/datamgr"
import { getCardAttribute } from "../../src/utils/misc"
import DraggableCharaIcon, { ItemTypes } from "../media/DraggableCharaIcon"
import { useDrop } from "react-dnd";
import CharaIconDropZone from "../media/CharaIconDropZone"

export default function Lane({ card, index, live, onCharaClick, onCharaDrop }: {
  card: Card, index: number, live?: Live,
  onCharaClick: (id: string) => void,
  onCharaDrop: (src: number, dest: number) => void,
}) {
  const { id, assetId, type, name, characterId } = card
  const attribute = getCardAttribute(card)
  const chara = getChara(characterId)
  const _index = index as keyof typeof gameIndex2LaneIndex

  return (
    <div className={`flex flex-col h-screen items-center justify-start p-4 border-y-0`}>
      <CharaIconDropZone
        index={index}
        onCharaDrop={onCharaDrop}
        className="flex flex-col items-center justify-start border-y-0 w-full"
      >
        <DraggableCharaIcon
          cid={id}
          aid={assetId}
          role={type}
          index={index}
          attribute={attribute}
          onCharaClick={onCharaClick}
        />
        <p>{chara.name}</p>
        <div className={classNames( // FIXME: color value shall be connected with the music pattern, not the card type.
          "w-full h-0.5 rounded-sm",
          attribute === AttributeType.Dance ? "bg-dance"
            : attribute === AttributeType.Vocal ? "bg-vocal"
              : "bg-visual"
        )} />
      </CharaIconDropZone>
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
