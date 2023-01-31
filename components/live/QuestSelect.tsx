import { Chip, Divider, Modal, Select, Space } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { getRawGvgQuests, getRawInsideDbQuests, getRawLeagueQuests, getRawMarathonQuests, getRawPvpQuests, getRawRaidQuests } from "hoshimi-venus/out/db/dao/quest_dao";
import { getQuest } from "hoshimi-venus/out/db/repository/quest_repository";
import { AttributeType, MusicChartType } from "hoshimi-venus/out/types/proto/proto_enum";
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";
import { WapLiveAbility } from "hoshimi-venus/out/types/wap/skill_waps";
import { t } from "i18next";
import { Dispatch, ForwardedRef, forwardRef, SetStateAction, useEffect, useMemo, useState } from "react";
import { QuestIdMap } from "../../src/static/quest_id_map";
import { getMusicJacket } from "../../src/utils/misc";
import SkillIcon from "../media/SkillIcon";
import ImageAsset from "../misc/ImageAsset";

const QuestSelect = forwardRef<HTMLDivElement, QuestSelectProps>(_QuestSelect)
export default QuestSelect

type QuestSelectProps = {
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>,
  initQuestId: string | undefined,
  setWapQuest: (wapQuest: WapQuest | undefined) => void,
} & Partial<HTMLDivElement>

function _QuestSelect({
  opened,
  setOpened,
  initQuestId,
  setWapQuest,
  ...others
}: QuestSelectProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const genre = Object.keys(QuestIdMap)

  const [jacketLoading, setJacketLoading] = useState(false)

  const [questTypeChip, setQuestTypeChip] = useLocalStorage<string | undefined>({
    key: "QuestSelect_questType",
    defaultValue: undefined,
  })
  // questId
  const [selected, setSelected] = useLocalStorage<string | undefined>({
    key: "QuestSelect_selected",
    defaultValue: initQuestId,
  })

  const wapQuest = selected ? getQuest(selected) : undefined

  const onClose = () => {
    if (initQuestId !== selected) {
      selected && setWapQuest(getQuest(selected))
    }
    setOpened(false)
  }

  const getSelectorData = (chipType: string | undefined): {
    value: string,
    label: string,
  }[] => {
    if (chipType === undefined) return []
    if (!chipType.startsWith("Battle")) {
      const insideDbQuests = (() => {
        switch (chipType) {
          case undefined: return []

          // Event quest
          case "Marathon": return getRawMarathonQuests().sort((a, b) => {
            if (a.id < b.id) return 1
            if (a.id > b.id) return -1
            return 0
          }).map(questBase => {
            return {
              value: questBase.id,
              label: questBase.id,
            }
          })

          // Event multi-quest
          case "Raid": return getRawRaidQuests().sort((a, b) => {
            if (a.id < b.id) return 1
            if (a.id > b.id) return -1
            return 0
          }).map(questBase => {
            return {
              value: questBase.id,
              label: questBase.id,
            }
          })

          // Else
          default: return getRawInsideDbQuests(QuestIdMap[chipType as keyof typeof QuestIdMap])
            .sort().reverse().map(it => {
              let _label = it.name ?? "null_name"
              if (chipType === "DailySP" || chipType === "MainLive") {
                const flag = it.id.match(/\d+-\d+$/)
                _label += " " + flag
              }
              return {
                value: it.id,
                label: _label,
              }
            })
        }
      })()
      return insideDbQuests
    }

    // PvP, GvG, League
    const getDataFunction = (() => {
      switch (chipType) {
        case "BattlePvp": return getRawPvpQuests
        case "BattleGvg": return getRawGvgQuests
        case "BattleLeague": return getRawLeagueQuests
        default: return () => []
      }
    })()
    return getDataFunction().sort((a, b) => {
      if (a.id < b.id) return 1
      if (a.id > b.id) return -1
      return 0
    }).map(questBase => {
      return {
        value: questBase.id,
        label: questBase.id,
      }
    })
  }

  let selectorData = useMemo(() => {
    return getSelectorData(questTypeChip)
  }, [questTypeChip])

  const onQuestTypeChange = (chipType: string) => {
    console.debug(`onQuestTypeChange ${chipType}`)
    setQuestTypeChip(chipType)
    selectorData = getSelectorData(chipType)
    if (selectorData.length) {
      onSelectValueChange(selectorData[0].value)
    }
  }

  const onSelectValueChange = (v: string) => {
    console.debug(`onSelectValueChange ${v}`)
    const newQuest = getQuest(v)
    if (newQuest?.musicId !== wapQuest?.musicId) {
      setJacketLoading(true)
    }
    setSelected(v)
  }

  useEffect(() => {
    if (!wapQuest) {
      onQuestTypeChange("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const QuestTypeDivider = ({ keys }: { keys: string[] }) => {
    const quests: { [k: string]: string[] } = {
      "Daily": [],
      "Tower": [],
      "Battle": [],
      "Misc": [],
    }
    keys.forEach(key => {
      if (key.startsWith("Daily")) {
        quests["Daily"].push(key)
      } else if (key.startsWith("Tower")) {
        quests["Tower"].push(key)
      } else if (key.startsWith("Battle")) {
        quests["Battle"].push(key)
      } else {
        quests["Misc"].push(key)
      }
    })
    const group = (key: string) => {
      return (
        <div className="flex-1 flex flex-col justify-center gap-2">
          <Divider label={t(key)} labelPosition="center" />
          {quests[key].map((key, idx) =>
            <Chip className="self-center" value={key} key={key}>
              {t(key)}
            </Chip>
          )}
        </div>
      )
    }
    return (
      <>
        {group("Daily")}
        {group("Tower")}
        {group("Battle")}
        {group("Misc")}
      </>
    )
  }

  const AttributeOrnament = ({ position }: {
    position: number
  }) => {
    if (!wapQuest) {
      return <></>
    }
    const k = "position" + position + "AttributeType" as keyof WapQuest
    const attr = wapQuest[k] as AttributeType
    let laneInfo = t("less")
    let aCount = 0
    for (const ptn of wapQuest.musicChartPatterns) {
      if (ptn.position != position) {
        continue
      }
      if (ptn.type === MusicChartType.SpecialSkill) {
        laneInfo = t("SP")
        break
      } else if (ptn.type === MusicChartType.ActiveSkill) {
        aCount++
        if (aCount > 2) {
          laneInfo = t("more")
        }
      }
    }
    return (
      <div className="flex-1 text-center odd:bg-[#47474f] even:bg-[#31323c] first:rounded-l-md last:rounded-r-md">
        <div className={"text-sm text-slate-200 font-medium"}>
          {laneInfo}
        </div>
        <div className={`text-xs text-black font-medium ${attr == AttributeType.Dance ? "bg-dance" : attr == AttributeType.Vocal ? "bg-vocal" : "bg-visual"}`}>
          {AttributeType[attr]}
        </div>
      </div>
    )
  }

  const LiveInfo = ({ wQuest }: { wQuest: WapQuest }) => {
    const getText = (fmt: string, permil: number): string => {
      return `${t(fmt)} × ${permil / 1000 === 0 ? 1 : permil / 1000}`
    }
    return (
      <div className="mt-4 grid grid-cols-3">
        <div>{getText("specialSkillWeightPermil", wQuest.specialSkillWeightPermil)}</div>
        <div>{getText("activeSkillWeightPermil", wQuest.activeSkillWeightPermil)}</div>
        <div></div>
        <div>{getText("skillStaminaWeightPermil", wQuest.skillStaminaWeightPermil)}</div>
        <div>{getText("staminaRecoveryWeightPermil", wQuest.staminaRecoveryWeightPermil)}</div>
        <div></div>
        <div>{getText("beatDanceWeightPermil", wQuest.beatDanceWeightPermil)}</div>
        <div>{getText("beatVocalWeightPermil", wQuest.beatVocalWeightPermil)}</div>
        <div>{getText("beatVisualWeightPermil", wQuest.beatVisualWeightPermil)}</div>
      </div>
    )
  }

  const LiveBonuses = ({ liveAbility }: { liveAbility: WapLiveAbility }) => {
    return (
      <>
        <div className="mt-4 flex flex-row gap-2">
          <div className="w-14 h-14 aspect-square self-center">
            <SkillIcon wSkillLevel={liveAbility.skill} />
          </div>
          <div className="grow self-center text-start align-middle whitespace-pre-wrap">
            {liveAbility.skill.description}
          </div>
        </div>
      </>
    )
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("select a quest")}
      overlayOpacity={0.5}
      transitionDuration={300}
      overlayBlur={2}
      size="lg"
    >
      <div>
        <Chip.Group position="center" className="gap-6 items-start"
          value={questTypeChip} onChange={onQuestTypeChange}
        >
          <QuestTypeDivider keys={genre} />
        </Chip.Group>
        <Space h="xl" />
        <Select label={t("Select a Live")} placeholder="type to search..."
          searchable nothingFound={t("No matches")}
          maxDropdownHeight={270}
          onChange={onSelectValueChange} data={selectorData} value={selected}
        />
        <Divider my="xl" />
        <div className="w-16 h-16 mx-auto">
          {wapQuest
            && <ImageAsset
              onLoadingComplete={() => { setJacketLoading(false) }}
              aid={getMusicJacket(wapQuest.musicId)} aspect="1"
              className={jacketLoading ? "blur-md" : ""}
            />
          }
        </div>
        <div className="text-center">
          <p>{wapQuest && wapQuest.musicName}</p>
        </div>
        <div className="flex flex-row justify-center gap-0">
          <AttributeOrnament position={4} />
          <AttributeOrnament position={2} />
          <AttributeOrnament position={1} />
          <AttributeOrnament position={3} />
          <AttributeOrnament position={5} />
        </div>
        {wapQuest && <LiveInfo wQuest={wapQuest} />}
        {wapQuest?.liveBonuses?.map((liveBonus, idx) => (
          <LiveBonuses liveAbility={liveBonus} key={idx} />
        ))}
      </div>
    </Modal>
  )
}
