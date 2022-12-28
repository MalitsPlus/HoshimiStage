import { Badge, Center, Divider, HoverCard } from "@mantine/core"
import { IconStar } from "@tabler/icons"
import classNames from "classnames"
import { LiveCard } from "hoshimi-venus/out/types/card_types"
import { ActSkill, Live } from "hoshimi-venus/out/types/concert_types"
import { AttributeType, MusicChartType, SkillFailureType } from "hoshimi-venus/out/types/proto/proto_enum"
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps"
import { t } from "i18next"
import { memo } from "react"
import SkillIcon from "../media/SkillIcon"
import EffectRich from "./EffectRich"

type NoteFlowProps = {
  attribute: AttributeType,
  ingameIndex: number,
  live?: Live,
  wapQuest?: WapQuest,
}

const ActivatedSkill = ({
  card,
  skills,
}: {
  card: LiveCard,
  skills: ActSkill[],
}) => {
  return (
    <div className="whitespace-pre-wrap text-sm">
      {skills.map(aSkill => {
        const skill = card.getSkill(aSkill.skillIndex)
        return (<>
          <SkillIcon wSkillLevel={skill} />
          <div>{t("Order") + ": " + aSkill.order}</div>
          <div>{skill.description}</div>
        </>)
      })}
    </div>
  )
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
        const card = live?.liveDeck.getCard(ingameIndex)
        const { aSkill, failureFlag } = chart?.actPosition === ingameIndex
          ? { aSkill: chart.actSkill, failureFlag: chart.failureFlag }
          : { aSkill: undefined, failureFlag: undefined }
        const pSkills = chart?.actPSkills
          .filter(p => p.cardIndex === ingameIndex)
        const activating = [aSkill, ...pSkills ?? [undefined]].filter(it => it !== undefined)

        return (
          <HoverCard width="auto" shadow="md" key={ptn.sequence} position="left" offset={15} withArrow transitionDuration={0} openDelay={100} closeDelay={0} >
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
                  : <div className={`${pSkills?.length ? "h-1 w-1 bg-rose-500" : "h-0.5 w-0.5 bg-neutral-600/75"} rounded-full z-10`}></div>}
              </div>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <div className="flex flex-row gap-2">
                {aSkill !== undefined || failureFlag !== undefined || pSkills?.length
                  ? <>
                    <div>
                      {failureFlag
                        ? <div>
                          <Badge variant="filled" color="red" className="normal-case">{t(SkillFailureType[failureFlag])}</Badge>
                        </div>
                        : null
                      }
                      {aSkill && card
                        ? (<>
                          <Divider label={<><IconStar size={14} color="#fbbf24" fill="#fbbf24" />{t("Active Skill")}</>} labelPosition="center" />
                          <ActivatedSkill card={card} skills={[aSkill]} />
                        </>)
                        : null
                      }
                      {pSkills?.length && card
                        ? (<>
                          <Divider label={<><IconStar size={14} color="#38bdf8" fill="#38bdf8" />{t("Passive Skills")}</>} labelPosition="center" />
                          <ActivatedSkill card={card} skills={pSkills} />
                        </>)
                        : null
                      }
                    </div>
                    <Divider orientation="vertical" />
                  </>
                  : null
                }

                <div className="grid grid-cols-2 gap-x-2 [direction:ltr] content-start">
                  <div className="text-sm">{ptn.sequence}</div>
                  <div className="text-sm">{chart ? chart.userStatuses[0].combo + " " + t("Combo") : null}</div>
                  {interval ? <><Divider my={4} className="col-span-2" /><div className="text-sm">{t("Interval")}</div><div className="text-sm">{interval}</div></> : null}
                  {chart && status
                    ? (<>
                      <Divider my={4} className="col-span-2" />
                      <div className="text-dance">Dance</div><div className="text-dance">{status.dance}</div>
                      <div className="text-vocal">Vocal</div><div className="text-vocal">{status.vocal}</div>
                      <div className="text-visual">Visual</div><div className="text-visual">{status.visual}</div>
                      <div className="text-stamina">Stamina</div><div className="text-stamina">{status.stamina} ({(status.stamina / (card?.deckStamina ?? 1) * 100).toFixed(1)}%)</div>
                      <Divider my={4} className="col-span-2" />
                      {status.skillStatuses.map((skillStat, idx) => {
                        const isActivating = activating.some(act => act?.skillIndex === skillStat.skillIndex)
                        return (<>
                          <div>Skill {skillStat.skillIndex}</div>
                          <div className={isActivating ? "text-sky-400"
                            : skillStat.coolTime || !skillStat.hasTimes() ? "text-rose-500" : "text-emerald-500"
                          } >
                            {isActivating ? "Activating"
                              : !skillStat.hasTimes() ? "Exhausted"
                                : skillStat.coolTime ? skillStat.coolTime : "Ready"}
                          </div>
                        </>)
                      })}
                      {status.effects.length ? <Divider my={4} className="col-span-2" /> : null}
                      {[...new Set(status.effects.map(eff => eff.efficacyType))].map(effType => {
                        const sumGrade = status.getEffectSumOrMaxGrade(effType, true, true)
                        return (<>
                          <EffectRich type={effType} />
                          <div>{sumGrade}</div>
                        </>
                        )
                      })}
                    </>)
                    : null
                  }
                </div>
              </div>
            </HoverCard.Dropdown>
          </HoverCard>
        )
      })}
    </div >
  )
}

export default memo(NoteFlow)
