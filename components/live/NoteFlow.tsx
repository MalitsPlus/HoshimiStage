import { Center, HoverCard } from "@mantine/core"
import classNames from "classnames"
import { Live } from "hoshimi-venus/out/types/concert_types"
import { AttributeType, MusicChartType } from "hoshimi-venus/out/types/proto/proto_enum"
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps"
import { memo } from "react"

type NoteFlowProps = {
  attribute: AttributeType,
  ingameIndex: number,
  live?: Live,
  wapQuest?: WapQuest,
}

const NoteFlow = ({
  attribute,
  ingameIndex,
  live,
  wapQuest,
}: NoteFlowProps) => {
  console.log("rendered noteflow")
  if (live === undefined && wapQuest === undefined) {
    return null
  }

  const patterns = live?.quest.musicChartPatterns ?? wapQuest?.musicChartPatterns!

  return (
    <div className="flex flex-col h-[98%] w-20 justify-start items-center">
      {patterns.map(ptn => {
        return (
          <HoverCard width={140} shadow="md" key={ptn.sequence} position="left" offset={15} withArrow openDelay={80} closeDelay={0} >
            <HoverCard.Target>
              <div className="h-1 w-1 grow shrink flex justify-center items-center cursor-pointer">
                {ptn.position === ingameIndex
                  ? (
                    <div className={classNames(
                      "grow shrink aspect-square overflow-visible rounded-full text-center font-medium text-white",
                      ptn.type === MusicChartType.SpecialSkill ? "h-7 w-7 leading-5 border-solid border-4" : "h-5 w-5 leading-5",
                      ptn.type === MusicChartType.SpecialSkill
                        ? attribute === AttributeType.Dance ? "border-dance-acc"
                          : attribute === AttributeType.Vocal ? "border-vocal-acc"
                            : attribute === AttributeType.Visual ? "border-visual-acc"
                              : "bg-slate-600" : "",
                      attribute === AttributeType.Dance ? "bg-dance"
                        : attribute === AttributeType.Vocal ? "bg-vocal"
                          : attribute === AttributeType.Visual ? "bg-visual"
                            : "bg-slate-600"
                    )}>
                      <Center>
                        {ptn.sequence}
                      </Center>
                    </div>
                  )
                  : <div className="h-0.5 w-0.5 bg-neutral-600/75 rounded-full z-10"></div>}
              </div>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <div>{ptn.sequence}</div>
            </HoverCard.Dropdown>
          </HoverCard>
        )
      })}
    </div>
  )
}

export default memo(NoteFlow)
