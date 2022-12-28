import { SkillEfficacyType } from "hoshimi-venus/out/types/proto/proto_enum"
import { t } from "i18next"
import { ComponentProps, memo } from "react"
import EfficacyIcon from "../media/EfficacyIcon"

const EffectRich = ({
  type,
  ...others
}: {
  type: SkillEfficacyType,
} & ComponentProps<"div">) => {
  return (
    <div className="flex flex-row gap-x-1 items-center" {...others}>
      <EfficacyIcon effType={type} />
      {t(SkillEfficacyType[type])}
    </div>
  )
}

export default memo(EffectRich)
