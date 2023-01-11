import { Badge, Divider, HoverCard } from "@mantine/core";
import classNames from "classnames";
import { WeaknessAllList } from "hoshimi-venus/out/concert/consts/efficacy_list";
import { Effect, Live } from "hoshimi-venus/out/types/concert_types";
import { t } from "i18next";
import { memo } from "react";
import { EffColor } from "../../src/static/efficacy_flow_color";
import { getPrivilegedEfficacyList } from "../../src/utils/data_mgr";
import EffectRich from "./EffectRich";

type EffIdxDictType = { [uuid: string]: number }

const findMinAvaliableIdx = (
  effIdxDict: { [uuid: string]: number }, effs: Effect[]
): number => {
  const unavaliables = effs.map(eff => effIdxDict[eff.id])
  for (let i = 1; i <= 12; i++) {
    if (!unavaliables.includes(i)) {
      return i
    }
  }
  return 0
}

const flowPosition: {
  [k: number]: string
} = {
  1: "col-start-1 order-1",
  2: "col-start-2 order-2",
  3: "col-start-3 order-3",
  4: "col-start-4 order-4",
  5: "col-start-5 order-5",
  6: "col-start-6 order-6",
  7: "col-start-7 order-7",
  8: "col-start-8 order-8",
  9: "col-start-9 order-9",
  10: "col-start-10 order-10",
  11: "col-start-11 order-11",
  12: "col-start-12 order-12",
}

type EffFlowProps = {
  ingameIndex: number,
  category: "privileged" | "general",
  live?: Live,
}

const EffRow = ({ prevEffs, curEffs, sequence, category, effIdxDict, ingameIndex, isLastNote }: {
  prevEffs: Effect[],
  curEffs: Effect[],
  sequence: number,
  category: "privileged" | "general",
  effIdxDict: EffIdxDictType,
  ingameIndex: number,
  isLastNote: boolean,
}) => {

  return (
    <div className={`grid grid-cols-12 h-[98%] w-full justify-items-center items-stretch ${category == "privileged" ? "[direction:rtl]" : ""}`}>
      {curEffs.filter(eff =>
        category == "privileged" && getPrivilegedEfficacyList().includes(eff.efficacyType)
        || category == "general" && !getPrivilegedEfficacyList().includes(eff.efficacyType)
      ).map((eff, idx, specifiedEffs) => {
        const isStart = !prevEffs.some(preEff => preEff.id === eff.id)
        const isEnd = eff.remain === 0 || isLastNote
        if (isStart) {
          console.log(`ingame index: ${ingameIndex}`)
          console.log(`sequence: ${sequence}`)
          if (effIdxDict[eff.id] === undefined) {
            effIdxDict[eff.id] = findMinAvaliableIdx(effIdxDict, specifiedEffs)
          }
        }
        return (
          <HoverCard width="auto" shadow="md" key={idx}
            position={category == "privileged" ? "left" : "right"}
            offset={15} withArrow transitionDuration={0} openDelay={100} closeDelay={0}
          >
            <HoverCard.Target>
              <div className={classNames("h-full w-1 grow shrink cursor-pointer",
                flowPosition[effIdxDict[eff.id]],
                isStart ? "rounded-t-full" : "",
                isEnd ? "rounded-b-full" : "",
                (() => {
                  if (WeaknessAllList.includes(eff.efficacyType)) {
                    if (sequence % 3 === 1) {
                      return `${EffColor[eff.efficacyType]}/80` ?? "bg-slate-500"
                    }
                  }
                  return EffColor[eff.efficacyType] ?? "bg-slate-500"
                })(),
              )}>
              </div>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <div className="grid grid-cols-[2fr_1fr] gap-x-2 [direction:ltr]">
                <div className="col-span-2 text-sm">{sequence + 1}</div>
                <div className="col-span-2 text-sm font-medium"><EffectRich type={eff.efficacyType} /></div>
                {/* <div className="col-span-2 text-sm font-medium">{t(SkillEfficacyType[eff.efficacyType])}</div> */}
                <Divider className="col-span-2 my-1" />
                <div>{t("Grade")}</div>
                <div>{eff.grade + (eff.strengthenValue ? ` (+${eff.strengthenValue})` : "")}</div>
                {eff.value !== 0
                  ? <>
                    <div>{t("Value")}</div>
                    <div>{eff.value}</div>
                  </>
                  : null}
                <div>{t("Remain")}</div>
                <div>{eff.remain + (eff.lengthenValue ? ` (+${eff.lengthenValue})` : "")}</div>
                <div>{t("Source")}</div>
                <div>{eff.sourceIndex > 100
                  ? t("Live Bonus")
                  : `${eff.sourceIndex} - ${eff.sourceSkillIndex}`}
                </div>
                <div className="col-span-2">
                  {eff.include
                    ? <Badge mr={4} variant="filled" className="normal-case">{t("Included")}</Badge>
                    : <Badge mr={4} variant="filled" color="pink" className="normal-case">{t("Unincluded")}</Badge>
                  }
                  {eff.isInstant ? <Badge mr={4} variant="filled" color="grape" className="normal-case">{t("Instant")}</Badge> : null}
                  {eff.migrated ? <Badge mr={4} variant="filled" color="violet" className="normal-case">{t("Migrated")}</Badge> : null}
                  {eff.ajusted ? <Badge mr={4} variant="filled" color="orange" className="normal-case">{t("Ajusted")}</Badge> : null}
                </div>
              </div>
            </HoverCard.Dropdown>
          </HoverCard>
        )
      })}
    </div >
  )
}

const EffFlow = ({
  ingameIndex,
  category,
  live
}: EffFlowProps) => {
  const effIdxDict: EffIdxDictType = {}

  if (live === undefined) {
    return (<div className="w-full h-full"></div>)
  }
  return (
    <div className={`flex flex-col h-[98%] w-full justify-start ${category == "privileged" ? "items-end" : "items-start"}`}>
      {live.charts.map((chart, idx, arr) => {
        const status = chart.cardStatuses.find(it => it.cardIndex === ingameIndex)!
        const prevEffs = idx === 0 ? [] : arr[idx - 1].cardStatuses.find(it => it.cardIndex === ingameIndex)!.effects
        const curEffs = status.effects
        return (
          <EffRow key={idx}
            prevEffs={prevEffs}
            curEffs={curEffs}
            sequence={idx}
            category={category}
            effIdxDict={effIdxDict}
            ingameIndex={ingameIndex}
            isLastNote={idx === live.quest.musicChartPatterns.length - 1}
          />
        )
      })}
    </div>
  )
}

export default memo(EffFlow)
