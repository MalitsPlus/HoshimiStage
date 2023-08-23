import { WapCard } from "hoshimi-venus/out/types/wap/card_waps"
import { SkillSearchOpts } from "./CardSearch"
import { AllWapCards } from "../../src/utils/data_repository"
import { SkillTargetType, SkillTriggerType } from "hoshimi-venus/out/types/proto/proto_enum"
import { groupPresets, targetTypesPresets, triggerTypesPresets } from "./searchOptionsPresets"
import CharaUpper from "../media/CharaUpper"
import { Card, Divider, Pagination, Space } from "@mantine/core"
import { WapSkill } from "hoshimi-venus/out/types/wap/skill_waps"
import SkillIcon from "../media/SkillIcon"
import NumberCompVertical from "../misc/NumberCompVertical"
import { Dispatch, SetStateAction, memo, useEffect, useState } from "react"


const searchFilter = (opts: SkillSearchOpts): {
  skillIndexes: number[], card: WapCard, id: string,
}[] => {
  const result: {
    skillIndexes: number[], card: WapCard, id: string,
  }[] = []
  for (const x of AllWapCards) {

    // character conditions
    if (opts.characters.length !== 0) {
      const selectedCharas = (() => {
        if (opts.characters.some(x =>
          groupPresets.some(g => g.id === x)
        )) {
          return opts.characters
            .reduce<string[]>((acc, cur) => {
              acc.push(...groupPresets.find(g => g.id === cur)?.charas ?? [])
              return acc
            }, [])
        }
        return opts.characters
      })()
      if (!selectedCharas.includes(x.characterId)) {
        continue
      }
    }

    // card conditions
    const rarityCondition = opts.cardStars.length === 0
      || x.initialRarity === 5 && opts.cardStars.includes("fivestar")
      || x.initialRarity !== 5 && opts.cardStars.includes("else")
    const cardTypeCondition = opts.cardTypes.length === 0
      || opts.cardTypes.includes(x.type)
    const cardAttributeCondition = opts.cardAttributes.length === 0
      || opts.cardAttributes.includes(x.attributeType)
    if (!rarityCondition || !cardTypeCondition || !cardAttributeCondition) {
      continue
    }

    // skill conditions
    for (const [index, s] of [x.skill1, x.skill2, x.skill3].entries()) {
      // skill type condition
      if (!(
        opts.skillTypes.length === 0
        || opts.skillTypes.includes(s.categoryType)
      )) {
        continue
      }
      const level = s.wapSkillLevels.slice(-1)[0]

      // efficacy conditions
      for (const e of level.wapSkillDetails) {
        // efficacy type condition
        if (!(
          opts.efficacyTypes.length === 0
          || opts.efficacyTypes.some(it => it == e.efficacy.type)
        )) {
          continue
        }

        // trigger conditions (skill or efficacy, any will do)
        const selectTriggers = (() => {
          if (opts.triggerTypes.some(x =>
            Object.keys(triggerTypesPresets).includes(x as string)
          )) {
            return opts.triggerTypes
              .reduce<typeof opts.triggerTypes>((acc, cur) => {
                acc.push(...triggerTypesPresets[cur as keyof typeof triggerTypesPresets])
                return acc
              }, [])
          }
          return opts.triggerTypes
        })()

        if (!(
          selectTriggers.length === 0
          || selectTriggers.some(it => it == (level.trigger?.type ?? SkillTriggerType.Unknown))
          && selectTriggers.some(it => it == (e.trigger?.type ?? SkillTriggerType.Unknown))
        )) {
          continue
        }

        // target conditions
        const selectTargets = (() => {
          if (opts.targetTypes.some(x =>
            Object.keys(targetTypesPresets).includes(x as string)
          )) {
            return opts.targetTypes
              .reduce<typeof opts.targetTypes>((acc, cur) => {
                acc.push(...targetTypesPresets[cur as keyof typeof targetTypesPresets])
                return acc
              }, [])
          }
          return opts.targetTypes
        })()

        if (!(
          selectTargets.length === 0
          || selectTargets.some(it => it == (e.efficacy.skillTarget?.type ?? SkillTargetType.Unknown))
        )) {
          continue
        }
        const r = result.find(it => it.id === x.id)
        if (r) {
          r.skillIndexes.push(index + 1)
        } else {
          result.push({
            skillIndexes: [index + 1],
            card: x,
            id: x.id,
          })
        }
        break
      }
    }
  }
  return result
}

const OneSkill = memo(function _({
  skill,
  highlight,
  defaultLevel = 6,
}: {
  skill: WapSkill,
  highlight: boolean,
  defaultLevel?: number,
}) {
  const [level, setLevel] = useState(defaultLevel)
  return (
    <div className={`flex space-x-2 ${highlight ? "" : "brightness-75"}`}>
      <div className="flex-none">
        <SkillIcon wSkillLevel={skill.wapSkillLevels[level - 1]} />
      </div>
      <div className="flex-none">
        <NumberCompVertical
          value={level}
          setValue={setLevel}
        />
      </div>
      <div className="flex-1 text-sm whitespace-pre-line">
        {skill.wapSkillLevels[level - 1].description}
      </div>
    </div>
  )
})

const OneResult = memo(function _({
  skillIndexes,
  card
}: {
  skillIndexes: number[],
  card: WapCard
}) {
  return (
    <Card shadow="sm" radius="md" withBorder>
      <div className="m-[-1rem] grid grid-cols-[128px_minmax(128px,_1fr)]">
        <CharaUpper
          pointer={true}
          id={card.id}
          assetId={card.assetId}
          role={card.type}
          attribute={card.attributeType}
          onCharaClick={() => { window.open(`https://ip.outv.im/en/cards/${card.id}`, "_blank") }}
        />
        <div className="p-2 space-y-4">
          <OneSkill skill={card.skill1} highlight={skillIndexes.includes(1)} />
          <OneSkill skill={card.skill2} highlight={skillIndexes.includes(2)} />
          <OneSkill skill={card.skill3} highlight={skillIndexes.includes(3)} defaultLevel={4} />
        </div>
      </div>
    </Card>
  )
})

const PER_PAGE = 10
export default function SearchResults({
  opts,
  activePage,
  setPage,
  className,
}: {
  opts: SkillSearchOpts,
  activePage: number,
  setPage: Dispatch<SetStateAction<number>>,
  className?: string,
}) {
  console.debug("SearchResults rendered")
  const list = searchFilter(opts)

  return (
    <div className={`space-y-4 ${className}`}>
      <Space h="xs" />
      <Pagination
        className="justify-center"
        value={activePage}
        onChange={setPage}
        siblings={1}
        boundaries={1}
        total={Math.ceil(list.length / PER_PAGE)}
      />
      <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-3">
        {list
          .slice((activePage - 1) * PER_PAGE, activePage * PER_PAGE)
          .map(x =>
            <div key={x.id}>
              <OneResult
                card={x.card}
                skillIndexes={x.skillIndexes}
              />
            </div>
          )}
      </div>
      <Pagination
        className="justify-center"
        value={activePage}
        onChange={setPage}
        total={Math.ceil(list.length / PER_PAGE)}
      />
      <Space h="xs" />
    </div>
  )
}