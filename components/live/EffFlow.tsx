import { HoverCard } from "@mantine/core"
import classNames from "classnames"
import { Effect, Live } from "hoshimi-venus/out/types/concert_types"
import { SkillEfficacyType } from "hoshimi-venus/out/types/proto/proto_enum"
import { memo } from "react"
import { EffColor } from "../../src/static/eff_color"
import { getPrivilegedEfficacyList } from "../../src/utils/datamgr"

type EffIdxDictType = { [uuid: string]: number }

const findMinAvaliableIdx = (
  effIdxDict: { [uuid: string]: number }, effs: Effect[]
): number => {
  const unavaliables = effs.map(eff => effIdxDict[eff.id])
  console.log("===start===")
  console.log(unavaliables)
  for (let i = 1; i <= 12; i++) {
    console.log(`i: ${i}`)
    if (!unavaliables.includes(i)) {
      console.log("not included!")
      console.log(`returned: ${i}`)
      console.log("===end===")
      return i
    }
  }
  console.log(`after added: ${unavaliables}`)
  console.log(`returned: ${unavaliables.length}`)
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
          <HoverCard width={140} shadow="md" key={idx} position="left" offset={15} withArrow openDelay={80} closeDelay={0} >
            <HoverCard.Target>
              <div className={classNames("h-full w-1 grow shrink cursor-pointer",
                flowPosition[effIdxDict[eff.id]],
                isStart ? "rounded-t-full" : "",
                isEnd ? "rounded-b-full" : "",
                EffColor[eff.efficacyType] ?? "bg-slate-500",
                // (() => {
                //   switch (eff.efficacyType) {
                //     case SkillEfficacyType.ScoreUp: return "bg-[#59f1ff]"
                //     case SkillEfficacyType.BeatScoreUp: return "bg-[#46d3e0]"
                //     case SkillEfficacyType.VocalUp:
                //     case SkillEfficacyType.VocalBoost: return "bg-vocal"
                //     case SkillEfficacyType.DanceUp:
                //     case SkillEfficacyType.DanceBoost: return "bg-dance"
                //     case SkillEfficacyType.VisualUp:
                //     case SkillEfficacyType.VisualBoost: return "bg-visual"
                //     default: return "bg-emerald-500"
                //   }
                // })()
              )}
              >
              </div>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <div>{`${sequence + 1}`} - {SkillEfficacyType[eff.efficacyType]}</div>
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
