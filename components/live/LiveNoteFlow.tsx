import { Live } from "hoshimi-venus/out/types/concert_types"
import { AttributeType } from "hoshimi-venus/out/types/proto/proto_enum"
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps"
import { memo } from "react"
import EffFlow from "./EffFlow"
import NoteFlow from "./NoteFlow"

type LiveNoteFlowProps = {
  attribute: AttributeType,
  ingameIndex: number,
  live?: Live,
  wapQuest?: WapQuest,
}

const LiveNoteFlow = ({
  attribute,
  ingameIndex,
  live,
  wapQuest,
}: LiveNoteFlowProps) => {

  if (live === undefined && wapQuest === undefined) {
    return null
  }
  return (
    <div className="grow w-full h-full flex flex-row justify-center items-start">
      <EffFlow ingameIndex={ingameIndex} live={live} category="privileged" />
      <NoteFlow
        attribute={attribute}
        ingameIndex={ingameIndex}
        live={live}
        wapQuest={wapQuest}
      />
      <EffFlow ingameIndex={ingameIndex} live={live} category="general" />
    </div>
  )
}

export default memo(LiveNoteFlow)
