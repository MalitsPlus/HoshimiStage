import { AttributeType, CardType, SkillCategoryType } from "hoshimi-venus/out/types/proto/proto_enum";
import { WapSkillLevel } from "hoshimi-venus/out/types/wap/skill_waps";
import Image from "next/image";
import { memo } from "react";
import { getAssetUri } from "../../src/utils/resmgr";
import { getSkillAssetId } from "../../src/utils/skill_icon";
import ImageAsset from "../misc/ImageAsset";

const PLACEHOLDER_SVG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOs3/a/HgAGpQK1AGcMqQAAAABJRU5ErkJggg=='

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
  const [part1, part2, part3, corner] = getSkillAssetId(wSkillLevel)
  return (
    <div className="relative rounded-md aspect-square w-14 h-14 border-solid border-2 border-zinc-700">
      <Image
        src={"bg"}
        alt="bg"
        fill
        className="object-fill"
        placeholder="blur"
        blurDataURL={PLACEHOLDER_SVG}
      />

      {part1
        ? <Image
          src={getAssetUri("image", part1)}
          alt={part1}
          width={16}
          height={16}
          className="overflow-hidden"
        />
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
