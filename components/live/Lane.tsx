import classNames from "classnames"
import { Live } from "hoshimi-venus/out/types/concert_types"
import { AttributeType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps"
import { getChara, getData } from "../../src/utils/datamgr"
import CharaIconDropZone from "../media/CharaIconDropZone"
import DraggableCharaIcon from "../media/DraggableCharaIcon"
import { index2GamePos } from "./Stage"

export default function Lane({ index, card, wapQuest, live, onCharaClick, onCharaDrop }: {
  index: number, card?: Card, wapQuest?: WapQuest, live?: Live,
  onCharaClick: () => void,
  onCharaDrop: (srcId: string, srcIndex: number, dest: number) => void,
}) {
  const { id, assetId, type, name, characterId } = card ?? {
    id: undefined,
    assetId: undefined,
    type: undefined,
    name: undefined,
    characterId: undefined,
  }
  const attribute = wapQuest ? (wapQuest[`position${index2GamePos[index]}AttributeType` as keyof WapQuest]) as AttributeType : AttributeType.Unknown
  const chara = characterId ? getData(getChara, characterId) : undefined

  return (
    <div className={`flex flex-col grow items-center justify-start p-4 border-y-0`}>
      <CharaIconDropZone
        index={index}
        onCharaDrop={onCharaDrop}
        className="flex flex-col items-center justify-start border-y-0 w-full"
      >
        <DraggableCharaIcon 
          card={card}
          index={index}
          canDrag={card ? true : false}
          onCharaClick={onCharaClick}
        />
        <p>{chara?.name ?? "unselected"}</p>
        <div className={classNames( // FIXME: color value shall be connected with the music pattern, not the card type.
          "w-full h-0.5 rounded-sm",
          attribute === AttributeType.Dance ? "bg-dance"
            : attribute === AttributeType.Vocal ? "bg-vocal"
              : attribute === AttributeType.Visual ? "bg-visual"
                : "bg-slate-600"
        )}
        />
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
