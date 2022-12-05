import { Chip, Divider, Modal, Select, Space } from "@mantine/core";
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { QuestIdMap } from "../../src/static/quest_id_map";
import { getRawQuests } from "hoshimi-venus/out/db/dao/quest_dao";
import { getQuest } from "hoshimi-venus/out/db/repository/quest_repository";
import ImageAsset from "../misc/ImageAsset";
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";

export default function QuestSelect() {
  const genre = Object.keys(QuestIdMap)
  const [quest, setQuest] = useState<string | null>(null)
  const [questType, setQuestType] = useState<string | null>(null)
  const [wapQuest, setWapQuest] = useState<WapQuest | undefined>(undefined)
  // let wapQuest: WapQuest | undefined = undefined

  const selectorData = useMemo(() => {
    return !!questType
      ? getRawQuests(QuestIdMap[questType as keyof typeof QuestIdMap])
        .sort().reverse().map(it => {
          let _label = it.name
          if (questType === "DailySP" || questType === "MainLive") {
            const flag = it.id.match(/\d+-\d+$/)
            _label += " " + flag
          }
          return {
            value: it.id,
            label: _label,
          }
        })
      : []
  }, [questType])

  const onQuestTypeChange = (v: string) => {
    console.log(`onQuestTypeChange ${v}`)
    setQuestType(v)
  }

  const onSelectValueChange = (v: string) => {
    console.log(`onSelectValueChange ${v}`)
    setQuest(v)
    setWapQuest(getQuest(v))
  }

  useEffect(() => {
    if (selectorData.length) {
      onSelectValueChange(selectorData[0].value)
    }
  }, [questType])

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
    return (
      <div className="text-center odd:bg-gray-100 even:bg-zinc-700">
        <div className={"text-sm  " }>
          {wapQuest?.areaId}
        </div>
        <div className="text-xs bg-vocal">
          {wapQuest?.areaId}
        </div>
      </div>
    )
  }

  return (
    <>
      <Chip.Group position="center" className="gap-6 items-start"
        onChange={onQuestTypeChange}
      >
        <QuestTypeDivider keys={genre} />
      </Chip.Group>
      <Space h="xl" />
      <Select label={t("Select a Live")} placeholder="input to search..."
        searchable clearable nothingFound={t("No matches")}
        maxDropdownHeight={270}
        value={quest} onChange={onSelectValueChange} data={selectorData}
      />
      <Divider my="xl" />
      <div className="w-16 h-16 mx-auto">
        <ImageAsset aid="img_card_thumb_1_kkr-04-casl-00" aspect="1" />
      </div>
      <div className="text-center">
        <p>{wapQuest && wapQuest.musicName}</p>
      </div>
      <div className="flex flex-row justify-center gap-0">
        <AttributeOrnament position={1} />
        <AttributeOrnament position={2} />
        <AttributeOrnament position={3} />
        <AttributeOrnament position={4} />
        <AttributeOrnament position={5} />
      </div>
    </>
  )
}
