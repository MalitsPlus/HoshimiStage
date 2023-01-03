import { Center, HoverCard } from "@mantine/core"
import classNames from "classnames"
import { Live } from "hoshimi-venus/out/types/concert_types"
import { AttributeType, MusicChartType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps"
import { getChara, getData } from "../../src/utils/datamgr"
import CharaIconDropZone from "../media/CharaIconDropZone"
import DraggableCharaIcon from "../media/DraggableCharaIcon"
import { index2GamePos } from "./Stage"
import LiveNoteFlow from "./LiveNoteFlow"

export default function Lane({
  index,
  card,
  wapQuest,
  live,
  onCharaClick,
  onCharaDrop
}: {
  index: number,
  card?: Card,
  wapQuest?: WapQuest,
  live?: Live,
  onCharaClick: () => void,
  onCharaDrop: (srcId: string, srcIndex: number, dest: number) => void,
}) {
  const ingameIndex = index2GamePos[index]
  const { id, assetId, type, name, characterId } = card ?? {
    id: undefined,
    assetId: undefined,
    type: undefined,
    name: undefined,
    characterId: undefined,
  }
  const attribute = wapQuest ? (wapQuest[`position${index2GamePos[index]}AttributeType` as keyof WapQuest]) as AttributeType : AttributeType.Unknown
  const chara = characterId ? getData(getChara, characterId) : undefined
  let noteInfo = ""
  let minGap = 9999
  if (live !== undefined || wapQuest !== undefined) {
    noteInfo = "A"
    const ptns = live?.quest.musicChartPatterns ?? wapQuest?.musicChartPatterns!
    let preA = -9999

    for (const ptn of ptns) {
      if (ptn.position !== ingameIndex) {
        continue
      }
      if (ptn.type === MusicChartType.SpecialSkill) {
        noteInfo = "SP "
      } else if (ptn.type === MusicChartType.ActiveSkill) {
        const gap = ptn.sequence - preA
        if (gap < minGap) {
          minGap = gap
        }
        preA = ptn.sequence
      }
    }
  }

  return (
    <div className={`flex flex-col grow items-center justify-start h-full w-full px-4 border-y-0`}>
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
        <div className="w-full my-2 text-center">{chara?.name ?? "unselected"}</div>
        <div className="w-full text-center text-xs">{(live || wapQuest) && `${noteInfo} ${minGap === 9999 ? "" : minGap}`}</div>
        <div className={classNames( // FIXME: color value shall be connected with the music pattern, not the card type.
          "w-full h-0.5 rounded-sm mb-1",
          attribute === AttributeType.Dance ? "bg-dance"
            : attribute === AttributeType.Vocal ? "bg-vocal"
              : attribute === AttributeType.Visual ? "bg-visual"
                : "bg-slate-600"
        )}>
        </div>
      </CharaIconDropZone>
      <LiveNoteFlow
        attribute={attribute}
        ingameIndex={ingameIndex}
        live={live}
        wapQuest={wapQuest}
      />
    </div >
  )
}
