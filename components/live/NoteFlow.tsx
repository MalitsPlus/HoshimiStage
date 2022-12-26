import { Center, Divider, HoverCard } from "@mantine/core"
import classNames from "classnames"
import { Live } from "hoshimi-venus/out/types/concert_types"
import { AttributeType, MusicChartType, SkillEfficacyType } from "hoshimi-venus/out/types/proto/proto_enum"
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps"
import { t } from "i18next"
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
  let prevASequence = 0

  return (
    <div className="flex flex-col h-[98%] w-20 justify-start items-center">
      {patterns.map((ptn, idx, arr) => {
        let interval = 0
        if (ptn.position === ingameIndex) {
          if (ptn.type === MusicChartType.ActiveSkill) {
            if (prevASequence !== 0) {
              interval = ptn.sequence - prevASequence
            }
            prevASequence = ptn.sequence
          }
        }
        const chart = live?.charts.find(chart => chart.sequence === ptn.sequence)
        const status = chart?.getCardStatus(ingameIndex)
        const effSet = new Set(status?.effects.map(eff => eff.efficacyType))
        return (
          <HoverCard width="auto" shadow="md" key={ptn.sequence} position="left" offset={15} transitionDuration={0} withArrow openDelay={80} closeDelay={0} >
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
              <div className="grid grid-cols-[2fr_1fr] gap-x-2 [direction:ltr]">
                <div className="col-span-2 text-sm">{ptn.sequence}</div>
                {interval ? <><div>{t("Interval")}</div><div>{interval}</div></> : null}
                {
                  chart && status
                    ? (<>
                      <Divider my={4} className="col-span-2" />
                      <div className="text-dance">Dance</div><div className="text-dance">{status.dance}</div>
                      <div className="text-vocal">Vocal</div><div className="text-vocal">{status.vocal}</div>
                      <div className="text-visual">Visual</div><div className="text-visual">{status.visual}</div>
                      <div className="text-stamina">Stamina</div><div className="text-stamina">{status.stamina}</div>
                      <Divider my={4} className="col-span-2" />
                      {status.skillStatuses.map((skillStat, idx) => (<>
                        <div>Skill {skillStat.skillIndex}</div>
                        <div className={skillStat.coolTime ? "text-red-600" : "text-green-600"} >{skillStat.coolTime ? skillStat.coolTime : "Ready"}</div>
                      </>))}
                      <Divider my={4} className="col-span-2" />
                      {[...new Set(status.effects.map(eff => eff.efficacyType))].map(effType => {
                        return (<>
                          <div>{t(SkillEfficacyType[effType])}</div>
                          <div>{status.getEffectSumOrMaxGrade(effType)}</div>
                        </>
                        )
                      })}
                    </>)
                    : null
                }
              </div>
            </HoverCard.Dropdown>
          </HoverCard>
        )
      })}
    </div >
  )
}

export default memo(NoteFlow)
