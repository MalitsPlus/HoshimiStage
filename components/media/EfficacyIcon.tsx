import { WeaknessAllList } from "hoshimi-venus/out/concert/consts/efficacy_list"
import { SkillEfficacyType } from "hoshimi-venus/out/types/proto/proto_enum"
import { memo } from "react"
import { EffIcon } from "../../src/static/efficacy_asset_id"
import ImageAsset from "../misc/ImageAsset"

const EfficacyIcon = ({
  effType
}: {
  effType: SkillEfficacyType
}) => {
  const assetId = EffIcon[effType]
  if (!assetId) {
    return null
  }
  const isDebuff = WeaknessAllList.includes(effType)
  return (
    <div className="relative rounded-full aspect-square w-6 h-6">
      <div className="absolute aspect-square top-0 left-0 w-full h-full">
        <ImageAsset
          aid={isDebuff ? "frame_debuff" : "frame_buff"}
          aspect="1"
          env="local"
          className=""
        />
      </div>
      <div className="absolute aspect-square top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10/12 h-10/12 z-10">
        <ImageAsset
          aid={"img_icon_skill-normal_" + assetId}
          aspect="1"
          className=""
        />
      </div>
    </div >
  )
}

export default memo(EfficacyIcon)
