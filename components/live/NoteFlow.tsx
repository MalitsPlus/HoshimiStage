import { Badge, Center, Divider, HoverCard } from "@mantine/core"
import { IconStar } from "@tabler/icons"
import classNames from "classnames"
import { LiveCard } from "hoshimi-venus/out/types/card_types"
import { ActSkill, CardStatus, Live } from "hoshimi-venus/out/types/concert_types"
import { AttributeType, MusicChartType, SkillEfficacyType, SkillFailureType } from "hoshimi-venus/out/types/proto/proto_enum"
import { CustomNote } from "hoshimi-venus/out/types/trans_types"
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps"
import { t } from "i18next"
import { Fragment, memo } from "react"
import { HighlightEfficacies, PriviAndHighlightEfficacies, PrivilegedEfficacies } from "../../src/static/highlight_efficacies"
import SkillIcon from "../media/SkillIcon"
import EffectRich from "./EffectRich"

type NoteFlowProps = {
  attribute: AttributeType,
  ingameIndex: number,
  customNotes: CustomNote[],
  live?: Live,
  wapQuest?: WapQuest,
  onToggleNote: (ingamePos: number, sequence: number) => void,
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
      {skills.map((aSkill, idx) => {
        const skill = card.getSkill(aSkill.skillIndex)
        return (<Fragment key={idx}>
          <SkillIcon wSkillLevel={skill} />
          <div>{t("Order") + ": " + aSkill.order}</div>
          <div>{skill.description}</div>
        </Fragment>)
      })}
    </div>
  )
}

const EffRichRow = memo(function _EffRichRow({
  efficacies,
  status,
}: {
  efficacies: SkillEfficacyType[] | undefined,
  status: CardStatus,
}) {
  return (
    <>
      {efficacies?.length ? <Divider my={4} className="col-span-2" /> : null}
      {efficacies?.map((effType, idx) => {
        const sumGrades = status.getEffectSumOrMaxGrade(effType, true, true)
        return (<Fragment key={idx}>
          <EffectRich type={effType} />
          <div>{`${sumGrades[0]} (${sumGrades[1].join("+")})`}</div>
        </Fragment>
        )
      })}
    </>
  )
})

const NoteFlow = ({
  attribute,
  ingameIndex,
  live,
  wapQuest,
  customNotes,
  onToggleNote,
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
        // a chart snapshot at just before beat activating
        const snapshot = live?.snapshot.find(snapshot => snapshot.sequence === ptn.sequence)
        // a chart at the ending of a turn
        const chart = live?.charts.find(chart => chart.sequence === ptn.sequence)
        // a status object at just before beat activating
        const status = snapshot?.getCardStatus(ingameIndex)
        // a status object at the ending of a turn
        const finalStatus = chart?.getCardStatus(ingameIndex)
        const card = live?.liveDeck.getCard(ingameIndex)
        // active skill in this turn, should use the ending chart
        const { aSkill, failureFlag } = chart?.actPosition === ingameIndex
          ? { aSkill: chart.actSkill, failureFlag: chart.failureFlag }
          : { aSkill: undefined, failureFlag: undefined }
        // p skills in this turn, also should use the ending chart
        const pSkills = chart?.actPSkills
          .filter(p => p.cardIndex === ingameIndex)
        const activating = [aSkill, ...pSkills ?? [undefined]].filter(it => it !== undefined)

        const efficacies = status ? [...new Set(status.effects.map(eff => eff.efficacyType))] : undefined
        const privilegedEfficacies = efficacies?.filter(it => PrivilegedEfficacies.includes(it))
        const pickupEfficacies = efficacies?.filter(it => HighlightEfficacies.includes(it))
        const normalEfficacies = efficacies?.filter(it => !PriviAndHighlightEfficacies.includes(it))

        const customOpponent = customNotes.some(
          it => it.ingamePos === ingameIndex
            && it.sequence === ptn.sequence
            && it.privilege === "opponent"
        )

        const isAssigned = chart?.actPosition !== chart?.originalActPosition && chart?.actPosition === ingameIndex

        return (
          <HoverCard width="auto" shadow="md" key={idx} position="left" offset={15} withArrow transitionDuration={0} openDelay={100} closeDelay={0} >
            <HoverCard.Target>
              <div
                className="h-1 w-1 grow shrink flex justify-center items-center cursor-pointer"
                onClick={() => {
                  if (ptn.position === ingameIndex) {
                    onToggleNote(ingameIndex, ptn.sequence)
                  }
                }}
              >
                {isAssigned ? (
                  <div className="grow shrink aspect-square overflow-visible
                  rounded-full text-center font-medium text-white
                  h-5 w-5 leading-5 bg-emerald-600">
                    <Center>
                      {ptn.sequence}
                    </Center>
                  </div>
                ) : ptn.position === ingameIndex
                  ? (
                    <div className={classNames(
                      "grow shrink aspect-square overflow-visible rounded-full text-center font-medium text-white",
                      ptn.type === MusicChartType.SpecialSkill ? "h-7 w-7 leading-5 border-solid border-4" : "h-5 w-5 leading-5",
                      ptn.type === MusicChartType.SpecialSkill
                        ? customOpponent ? "border-zinc-500"
                          : attribute === AttributeType.Dance ? "border-dance-acc"
                            : attribute === AttributeType.Vocal ? "border-vocal-acc"
                              : attribute === AttributeType.Visual ? "border-visual-acc"
                                : "bg-slate-600" : "",
                      customOpponent ? "bg-zinc-600"
                        : attribute === AttributeType.Dance ? "bg-dance"
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
                  <div className="text-sm">{snapshot ? snapshot.userStatuses[0].combo + " " + t("Combo") : null}</div>
                  {interval ? <><Divider my={4} className="col-span-2" /><div className="text-sm">{t("Interval")}</div><div className="text-sm">{interval}</div></> : null}
                  {snapshot && status && finalStatus
                    ? (<>
                      <Divider my={4} className="col-span-2" />
                      <div className="text-dance">Dance</div><div className="text-dance">{status.dance}</div>
                      <div className="text-vocal">Vocal</div><div className="text-vocal">{status.vocal}</div>
                      <div className="text-visual">Visual</div><div className="text-visual">{status.visual}</div>
                      <div className="text-stamina">Stamina</div><div className="text-stamina">{status.stamina} ({(status.stamina / (card?.deckStamina ?? 1) * 100).toFixed(1)}%)</div>
                      <Divider my={4} className="col-span-2" />
                      {finalStatus.skillStatuses.map((skillStat, idx) => {
                        const isActivating = activating.some(act => act?.skillIndex === skillStat.skillIndex)
                        return (<Fragment key={idx}>
                          <div>Skill {skillStat.skillIndex}</div>
                          <div className={isActivating ? "text-sky-400"
                            : skillStat.coolTime || !skillStat.hasTimes() ? "text-rose-500" : "text-emerald-500"
                          } >
                            {isActivating ? "Activating"
                              : !skillStat.hasTimes() ? "Exhausted"
                                : skillStat.coolTime ? skillStat.coolTime : "Ready"}
                          </div>
                        </Fragment>)
                      })}
                      <EffRichRow
                        efficacies={privilegedEfficacies}
                        status={status}
                      />
                      <EffRichRow
                        efficacies={pickupEfficacies}
                        status={status}
                      />
                      <EffRichRow
                        efficacies={normalEfficacies}
                        status={status}
                      />
                    </>)
                    : null
                  }
                </div>
              </div>
            </HoverCard.Dropdown>
          </HoverCard>
        )
      })}
    </div>
  )
}

export default memo(NoteFlow)
