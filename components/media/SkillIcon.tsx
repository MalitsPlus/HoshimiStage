import { WeaknessAllList } from "hoshimi-venus/out/concert/consts/efficacy_list";
import { GameSetting } from "hoshimi-venus/out/db/repository/setting_repository";
import { SkillCategoryType } from "hoshimi-venus/out/types/proto/proto_enum";
import { WapSkillLevel } from "hoshimi-venus/out/types/wap/skill_waps";

const concatNormal = (prefab: string) => {
  return "img_icon_skill-normal_" + prefab
}

export function getSkillAssetId(
  skill: WapSkillLevel
): (string | undefined)[] {
  const iconParts: string[] = []
  if (skill.categoryType === SkillCategoryType.Special) {
    iconParts[0] = "img_icon_skill_" + skill.assetId
  } else {
    skill.wapSkillDetails.forEach(detail => {
      const [, asset, , target, targetType] = detail.efficacyId.split('-')
      const prefab = asset.replaceAll('_', '-')
      if (!iconParts[0]) {
        // put first efficacy to main position
        iconParts[0] = concatNormal(prefab)
      } else {
        if (!iconParts[1] && GameSetting.skillEfficacyTypeScoreList.includes(detail.efficacy.type)) {
          // put first score-get efficacy to second position
          iconParts[1] = concatNormal(prefab)
        }
        if (!iconParts[2] && WeaknessAllList.includes(detail.efficacy.type)) {
          // put first debuff efficacy to third position
          iconParts[2] = concatNormal(prefab)
          // put target type to fourth position
          if (detail.efficacy.skillTarget?.isOpponent) {
            iconParts[3] = "opponent"
          } else if (GameSetting.skillEfficacyTypeWeaknessDownList.includes(detail.efficacy.type)) {
            iconParts[3] = "negative"
          } else {
            iconParts[3] = "neutral"
          }
        }
      }
    })
  }
  return iconParts
}
