import { Chip, ChipGroupProps, Divider, Group, MultiSelect, Space, Switch } from "@mantine/core"
import { getAllCharas } from "hoshimi-venus/out/db/repository/chara_repository"
import { AttributeType, CardType, SkillCategoryType, SkillEfficacyType, SkillTargetType, SkillTriggerType } from "hoshimi-venus/out/types/proto/proto_enum"
import i18next, { t } from "i18next"
import { ImageProps } from "next/image"
import { Dispatch, SetStateAction, useState } from "react"
import ImageAsset from "../misc/ImageAsset"
import MyButton from "../misc/MyButton"
import { SkillSearchOpts } from "./CardSearch"
import { ScoringEfficacies, groupPresets, targetTypesPresets, triggerTypesPresets } from "./searchOptionsPresets"

const ChipGroup = <T extends string | number>({
  children,
  value,
  onChange,
  ...props
}: {
  value: T[],
  onChange: (_: T[]) => void,
} & Omit<ChipGroupProps, "value" | "onChange">) => {
  const doChange = (v: string[]) => {
    if (v.every(x => !Number.isNaN(Number(x)))) {
      onChange(v.map(Number) as T[])
    } else {
      onChange(v as T[])
    }
  }
  return (
    <Chip.Group
      value={value.map(String)}
      onChange={(v: string[]) => { doChange(v) }}
      multiple
      {...props}
    >
      <Group spacing="4px">
        {children}
      </Group>
    </Chip.Group>
  )
}

const IconChip = <T extends { [_: number]: string }>({
  value,
  iconAid,
  EnumObj,
}: {
  value: string | number,
  iconAid?: string,
  EnumObj?: T,
} & Partial<ImageProps>) => {
  const i18nText = typeof value === "number" && EnumObj
    ? t(EnumObj[value])
    : t(value.toString())
  return (
    <Chip value={value.toString()}>
      {iconAid
        ? (
          <div className="relative aspect-square w-4 mr-0.5 inline-block align-[-3px]">
            <ImageAsset aid={iconAid} aspect="1" env="local" />
          </div>
        )
        : null
      }
      <span>{i18nText}</span>
    </Chip>
  )
}

const chararObj = getAllCharas().map(chara => ({
  value: chara.id, label: t(chara.name)
}))

const groupObj = groupPresets.map(group => ({
  value: group.id, label: t(group.name)
}))

const getEfficacyObj = () => {
  const r = []
  for (const [k, v] of Object.entries(SkillEfficacyType)) {
    if (Number.isNaN(+k)) {
      continue
    }
    r.push({ value: k, label: t(v.toString()) })
  }
  return r
}

const getTargetObj = () => {
  const r = []
  for (const [k, v] of Object.entries(SkillTargetType)) {
    if (Number.isNaN(+k)) {
      continue
    }
    r.push({ value: k, label: t(v.toString()) })
  }
  return r
}

const getTriggerObj = () => {
  const r = []
  for (const [k, v] of Object.entries(SkillTriggerType)) {
    if (Number.isNaN(+k)) {
      continue
    }
    r.push({ value: k, label: t(v.toString()) })
  }
  return r
}

export default function SearchOptions({
  opts,
  setOpts,
  className,
}: {
  opts: SkillSearchOpts,
  setOpts: Dispatch<SetStateAction<SkillSearchOpts>>,
  className?: string,
}) {
  console.debug("SearchOptions rendered")
  const [exScore, setExScore] = useState(true)
  const [pcsTarget, setPcsTarget] = useState(false)
  const [pcsTrigger, setPcsTrigger] = useState(false)
  const [showGroups, setShowGroups] = useState(false)
  const [effCandi, setEffCandi] = useState(getEfficacyObj().filter(x => !ScoringEfficacies.includes(+x.value)))
  const [targetCandi, setTargetCandi] = useState(Object.keys(targetTypesPresets).map(x => ({ value: x, label: t(x) })))
  const [triggerCandi, setTriggerCandi] = useState(Object.keys(triggerTypesPresets).map(x => ({ value: x, label: t(x) })))

  i18next.on('languageChanged', () => {
    setEffCandi(exScore
      ? getEfficacyObj().filter(x => !ScoringEfficacies.includes(+x.value))
      : getEfficacyObj())
    setTargetCandi(pcsTarget
      ? getTargetObj()
      : Object.keys(targetTypesPresets).map(x => ({ value: x, label: t(x) })))
    setTriggerCandi(pcsTrigger
      ? getTriggerObj()
      : Object.keys(triggerTypesPresets).map(x => ({ value: x, label: t(x) })))
  })

  const resetFilter = () => {
    setOpts({
      cardStars: ["fivestar"],
      skillTypes: [],
      cardTypes: [],
      cardAttributes: [],
      efficacyTypes: [],
      targetTypes: [],
      triggerTypes: [],
      characters: [],
    })
  }

  return (
    <div className={className}>
      <Space h="md" />
      <div className="float-right">
        <MyButton onClick={resetFilter}>
          {t("Reset Filter")}
        </MyButton>
      </div>
      <Divider my="md" label={t("Initial Rarity")} />
      <ChipGroup value={opts.cardStars} onChange={v => { setOpts(prev => ({ ...prev, cardStars: v })) }} >
        <IconChip value="fivestar" iconAid="icon_rarity" />
        <IconChip value="else" iconAid="icon_rarity" />
      </ChipGroup>

      <Divider my="md" label={t("CardType")} />
      <ChipGroup value={opts.cardTypes} onChange={v => { setOpts(prev => ({ ...prev, cardTypes: v })) }}>
        <IconChip value={CardType.Appeal} iconAid="icon_scorer_thumbnail" EnumObj={CardType} />
        <IconChip value={CardType.Technique} iconAid="icon_buffer_thumbnail" EnumObj={CardType} />
        <IconChip value={CardType.Support} iconAid="icon_supporter_thumbnail" EnumObj={CardType} />
      </ChipGroup>

      <Divider my="md" label={t("Attribute")} />
      <ChipGroup value={opts.cardAttributes} onChange={v => { setOpts(prev => ({ ...prev, cardAttributes: v })) }}>
        <IconChip value={AttributeType.Dance} iconAid="icon_parameter_dance" EnumObj={AttributeType} />
        <IconChip value={AttributeType.Vocal} iconAid="icon_parameter_vocal" EnumObj={AttributeType} />
        <IconChip value={AttributeType.Visual} iconAid="icon_parameter_visual" EnumObj={AttributeType} />
      </ChipGroup>

      <Divider my="md" label={t("SkillType")} />
      <ChipGroup value={opts.skillTypes} onChange={v => { setOpts(prev => ({ ...prev, skillTypes: v })) }}>
        <IconChip value={SkillCategoryType.Special} EnumObj={SkillCategoryType} />
        <IconChip value={SkillCategoryType.Active} EnumObj={SkillCategoryType} />
        <IconChip value={SkillCategoryType.Passive} EnumObj={SkillCategoryType} />
      </ChipGroup>

      <Divider my="md" label={t("EfficacyType")} />
      <Switch
        checked={exScore}
        onChange={(event) => {
          setExScore(event.currentTarget.checked)
          setEffCandi(event.currentTarget.checked
            ? getEfficacyObj().filter(x => !ScoringEfficacies.includes(+x.value))
            : getEfficacyObj()
          )
        }}
        label={t("Exclude Scoring Efficacies")}
      />
      <Space h="sm" />
      <MultiSelect
        data={effCandi}
        value={opts.efficacyTypes as any}
        onChange={v => setOpts(prev => ({
          ...prev, efficacyTypes: v as any
        }))}
        maxDropdownHeight={320}
        clearable
      />

      <Divider my="md" label={t("TargetType")} />
      <Switch
        checked={pcsTarget}
        onChange={(event) => {
          setPcsTarget(event.currentTarget.checked)
          setTargetCandi(event.currentTarget.checked
            ? getTargetObj()
            : Object.keys(targetTypesPresets).map(x => ({ value: x, label: t(x) }))
          )
        }}
        label={t("Use precise TargetTypes instead")}
      />
      <Space h="sm" />
      <MultiSelect
        data={targetCandi}
        value={opts.targetTypes as any}
        onChange={v => setOpts(prev => ({
          ...prev, targetTypes: v as any
        }))}
        maxDropdownHeight={320}
        clearable
      />

      <Divider my="md" label={t("TriggerType")} />
      <Switch
        checked={pcsTrigger}
        onChange={(event) => {
          setPcsTrigger(event.currentTarget.checked)
          setTriggerCandi(event.currentTarget.checked
            ? getTriggerObj()
            : Object.keys(triggerTypesPresets).map(x => ({ value: x, label: t(x) }))
          )
        }}
        label={t("Use precise TriggerTypes instead")}
      />
      <Space h="sm" />
      <MultiSelect
        data={triggerCandi}
        value={opts.triggerTypes as any}
        onChange={v => setOpts(prev => ({
          ...prev, triggerTypes: v as any
        }))}
        maxDropdownHeight={310}
        clearable
      />

      <Divider my="md" label={t("Characters")} />
      <Switch
        checked={showGroups}
        onChange={(event) => {
          setShowGroups(event.currentTarget.checked)
        }}
        label={t("Use groups instead")}
      />
      <Space h="sm" />
      <MultiSelect
        data={showGroups ? groupObj : chararObj}
        value={opts.characters}
        onChange={v => setOpts(prev => ({
          ...prev, characters: v
        }))}
        maxDropdownHeight={220}
        clearable
      />

    </div >
  )
}