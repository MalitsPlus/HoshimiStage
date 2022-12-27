import { SkillEfficacyType } from "hoshimi-venus/out/types/proto/proto_enum"
import { t } from "i18next"
import { ComponentProps, memo } from "react"
import { EffIcon } from "../../src/static/efficacy_static"
import ImageAsset from "../misc/ImageAsset"

const EffectRich = ({
  type,
  grade,
  ...others
}: {
  type: SkillEfficacyType,
  grade: number,
} & ComponentProps<"div">) => {
  return (
    <div className="flex flex-row items-center" {...others}>
      {EffIcon[type] ? <ImageAsset aid={EffIcon[type]!} aspect="1" width={16} height={16} /> : null}
      {t(SkillEfficacyType[type])}
    </div>
  )
}

export default memo(EffectRich)
