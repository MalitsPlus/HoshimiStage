import { AttributeType, CardType, SkillCategoryType } from "hoshimi-venus/out/types/proto/proto_enum";
import { WapSkillLevel } from "hoshimi-venus/out/types/wap/skill_waps";
import { memo } from "react";
import ImageAsset from "../misc/ImageAsset";

const SkillIcon = ({ wSkillLevel }:
  { wSkillLevel: WapSkillLevel }) => {

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
  return (
    <div className="relative rounded-md aspect-square w-14 h-14 border-solid border-2 border-zinc-700">
      <ImageAsset
        aid={"img_card_thumb_1_ai-04-casl-00"}
        aspect="1"
        className="rounded-md w-14 h-14"
      />
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
