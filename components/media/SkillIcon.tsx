import classNames from "classnames";
import { AttributeType, CardType, SkillCategoryType } from "hoshimi-venus/out/types/proto/proto_enum";
import { WapSkillLevel } from "hoshimi-venus/out/types/wap/skill_waps";
import { memo } from "react";
import { getSkillAssets, getSkillBg } from "../../src/utils/skill_icon";
import ImageAsset from "../misc/ImageAsset";

const getCardType = (_type: CardType) => {
  switch (_type) {
    case CardType.Appeal: return "icon_scorer_thumbnail"
    case CardType.Technique: return "icon_buffer_thumbnail"
    case CardType.Support: return "icon_supporter_thumbnail"
    default: return "unknown"
  }
}
const getCardAttribute = (_attribute: AttributeType) => {
  switch (_attribute) {
    case AttributeType.Dance: return "icon_rarity_dance"
    case AttributeType.Vocal: return "icon_rarity_vocal"
    case AttributeType.Visual: return "icon_rarity_visual"
    default: return "unknown"
  }
}

const SkillIcon = ({
  wSkillLevel
}: {
  wSkillLevel: WapSkillLevel
}) => {
  const bg = getSkillBg(wSkillLevel)
  const [part1, part2, part3, corner] = getSkillAssets(wSkillLevel)
  return (
    <div className="relative rounded-lg aspect-square w-14 h-14 overflow-hidden border-solid border-2 border-zinc-700">
      <ImageAsset
        aid={bg}
        aspect="1"
        env="local"
        className=""
      />

      {part1
        ? <div className={`absolute aspect-square bottom-0 left-0 ${part2 ? "w-4/5 h-4/5" : "w-full h-full"}`}>
          <ImageAsset
            aid={part1}
            aspect="1"
            className="z-20 overflow-hidden invert"
          />
        </div>
        : null
      }
      {part2
        ? <div className="absolute aspect-square top-0 right-0 w-1/2 h-1/2">
          <ImageAsset
            aid={part2}
            aspect="1"
            className="z-20 overflow-hidden invert"
          />
        </div>
        : null
      }
      {part3
        ? <>
          <div className="absolute aspect-square bottom-0 right-0 w-[30%] h-[30%]">
            <ImageAsset
              aid={part3}
              aspect="1"
              className="z-20 overflow-hidden invert"
            />
          </div>
          <div className={classNames("absolute w-3/4 h-[30%] bottom-0 -right-4 -rotate-45 z-10",
            corner === "opponent" ? "bg-[#fc7e44]"
              : corner === "negative" ? "bg-[#d80032]" : "bg-[#d7d7d6]")}>
          </div>
        </>
        : null
      }
      <div className="absolute top-0 left-0 z-20 leading-none text-sm text-slate-200 bg-zinc-700">
        {wSkillLevel.categoryType === SkillCategoryType.Special
          ? "SP"
          : wSkillLevel.categoryType === SkillCategoryType.Active
            ? "A" : "P"}
      </div>
      <div className="absolute bottom-0 left-0 z-20 leading-none text-xs text-slate-200 bg-zinc-700">
        {"Lv" + wSkillLevel.level}
      </div>
    </div>
  )
}

export default memo(SkillIcon)
