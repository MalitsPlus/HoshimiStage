import { Chip, Divider, Select, Space } from "@mantine/core";
import { t } from "i18next";
import { ForwardedRef, useEffect, useMemo, useState } from "react";
import { QuestIdMap } from "../../src/static/quest_id_map";
import { getRawQuests } from "hoshimi-venus/out/db/dao/quest_dao";
import { getQuest } from "hoshimi-venus/out/db/repository/quest_repository";
import ImageAsset from "../misc/ImageAsset";
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";
import { AttributeType, MusicChartType } from "hoshimi-venus/out/types/proto/proto_enum";
import SkillIcon from "../media/SkillIcon";
import { WapLiveAbility } from "hoshimi-venus/out/types/wap/skill_waps";
import { useClickOutside, useLocalStorage, useSessionStorage } from "@mantine/hooks";
import { getMusicJacket } from "../../src/utils/misc";
import { forwardRef } from "react"

const QuestSelect = forwardRef<HTMLDivElement, QuestSelectProps>(_QuestSelect)
export default QuestSelect

type QuestSelectProps = {
  wapQuest: WapQuest | undefined,
  setWapQuest: (wapQuest: WapQuest | undefined) => void,
} & Partial<HTMLDivElement>

function _QuestSelect({
  wapQuest,
  setWapQuest,
  ...others
}: QuestSelectProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const genre = Object.keys(QuestIdMap)

  const [questTypeChip, setQuestTypeChip] = useLocalStorage<string | undefined>({
    key: "QuestSelect_questType",
    defaultValue: undefined,
  })
  const [selected, setSelected] = useLocalStorage<string | null>({
    key: "QuestSelect_selected",
    defaultValue: undefined,
  })

  // useCLickOUtside 不行，在click下拉菜单时也会触发 。考虑把model搬进来
  const ref2 = useClickOutside<HTMLDivElement>(() => {
    console.log("rrrrrreeeeeeeeeeffffffffffffff2222222222222")
    selected && setWapQuest(getQuest(selected))
  })

  const getSelectorData = (v: string | undefined): {
    value: string,
    label: string,
  }[] => {
    return !!v
      ? getRawQuests(QuestIdMap[v as keyof typeof QuestIdMap])
        .sort().reverse().map(it => {
          let _label = it.name
          if (v === "DailySP" || v === "MainLive") {
            const flag = it.id.match(/\d+-\d+$/)
            _label += " " + flag
          }
          return {
            value: it.id,
            label: _label,
          }
        })
      : []
  }

  let selectorData = useMemo(() => {
    return getSelectorData(questTypeChip)
  }, [questTypeChip])

  const onQuestTypeChange = (v: string) => {
    console.log(`onQuestTypeChange ${v}`)
    setQuestTypeChip(v)
    selectorData = getSelectorData(v)
    if (selectorData.length) {
      onSelectValueChange(selectorData[0].value)
    }
  }

  const onSelectValueChange = (v: string) => {
    console.log(`onSelectValueChange ${v}`)
    setSelected(v)
    // setWapQuest(getQuest(v))
  }

  useEffect(() => {
    if (!wapQuest) {
      onQuestTypeChange("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   if (selectorData.length) {
  //     onSelectValueChange(selectorData[0].value)
  //   }
  // }, [questTypeChip])

  const QuestTypeDivider = ({ keys }: { keys: string[] }) => {
    const quests: { [k: string]: string[] } = {
      "Daily": [],
      "Tower": [],
      "Misc": [],
    }
    keys.forEach(key => {
      if (key.startsWith("Daily")) {
        quests["Daily"].push(key)
      } else if (key.startsWith("Tower")) {
        quests["Tower"].push(key)
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

  const LiveInfo = ({ wapQuest }: { wapQuest: WapQuest }) => {
    const getText = (fmt: string, permil: number): string => {
      return `${t(fmt)} × ${permil / 1000 === 0 ? 1 : permil / 1000}`
    }
    return (
      <div className="mt-4 grid grid-cols-3">
        <div>{getText("specialSkillWeightPermil", wapQuest.specialSkillWeightPermil)}</div>
        <div>{getText("activeSkillWeightPermil", wapQuest.activeSkillWeightPermil)}</div>
        <div></div>
        <div>{getText("skillStaminaWeightPermil", wapQuest.skillStaminaWeightPermil)}</div>
        <div>{getText("staminaRecoveryWeightPermil", wapQuest.staminaRecoveryWeightPermil)}</div>
        <div></div>
        <div>{getText("beatDanceWeightPermil", wapQuest.beatDanceWeightPermil)}</div>
        <div>{getText("beatVocalWeightPermil", wapQuest.beatVocalWeightPermil)}</div>
        <div>{getText("beatVisualWeightPermil", wapQuest.beatVisualWeightPermil)}</div>
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
    <div ref={ref2}>
      <Chip.Group position="center" className="gap-6 items-start"
        value={questTypeChip} onChange={onQuestTypeChange}
      >
        <QuestTypeDivider keys={genre} />
      </Chip.Group>
      <Space h="xl" />
      <Select label={t("Select a Live")} placeholder="input to search..."
        searchable nothingFound={t("No matches")}
        maxDropdownHeight={270}
        onChange={onSelectValueChange} data={selectorData} value={selected}
      />
      <Divider my="xl" />
      <div className="w-16 h-16 mx-auto">
        {wapQuest && <ImageAsset aid={getMusicJacket(wapQuest.musicId)} aspect="1" />}
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
      {wapQuest && <LiveInfo wapQuest={wapQuest} />}
      {wapQuest?.liveBonuses?.map((liveBonus, idx) => (
        <LiveBonuses liveAbility={liveBonus} key={idx} />
      ))}
    </div>
  )
}
