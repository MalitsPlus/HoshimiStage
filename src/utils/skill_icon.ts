import { WeaknessAllList } from "hoshimi-venus/out/concert/consts/efficacy_list";
import { GameSetting } from "hoshimi-venus/out/db/repository/setting_repository";
import { SkillCategoryType } from "hoshimi-venus/out/types/proto/proto_enum";
import { WapSkillEfficacy, WapSkillLevel } from "hoshimi-venus/out/types/wap/skill_waps";
import { EffIcon } from "../static/efficacy_asset_id";

const concatNormal = (prefab: string) => {
  return "img_icon_skill-normal_" + prefab
}

export function getSkillBg(skill: WapSkillLevel): string {
  let bg: string
  if (skill.categoryType === SkillCategoryType.Special) {
    bg = "bg_special_"
  } else {
    const efficacies = skill.wapSkillDetails.map(detail => detail.efficacy)
    if (efficacies.length === 1 && GameSetting.skillEfficacyTypeScoreList.includes(efficacies[0].type)) {
      bg = "bg_score_"
    } else if (efficacies.some(eff => GameSetting.skillEfficacyTypeStrengthList.includes(eff.type))) {
      bg = "bg_strength_"
    } else {
      bg = "bg_support_"
    }
  }
  bg += skill.level >= 6 ? "3" : skill.level >= 4 ? "2" : "1"
  return bg
}

export function getEfficacyAsset(
  efficacy: WapSkillEfficacy
): string | undefined {
  const prefab = EffIcon[efficacy.type]
  // const [, asset] = efficacy.id.split('-')
  // const prefab = asset.replaceAll('_', '-')
  return prefab ? concatNormal(prefab) : undefined
}

export function getSkillAssets(
  skill: WapSkillLevel
): (string | undefined)[] {
  const iconParts: (string | undefined)[] = []
  if (skill.categoryType === SkillCategoryType.Special) {
    iconParts[0] = "img_icon_skill_" + skill.assetId
  } else {
    skill.wapSkillDetails.forEach((detail, _, arr) => {
      const count = arr.length

      if (GameSetting.skillEfficacyTypeScoreList.includes(detail.efficacy.type)) {
        if (count === 1) {
          iconParts[0] = getEfficacyAsset(detail.efficacy)
        } else {
          iconParts[1] = getEfficacyAsset(detail.efficacy)
        }
      } else if (!iconParts[2] && WeaknessAllList.includes(detail.efficacy.type)) {
        // put first debuff efficacy to third position
        iconParts[2] = getEfficacyAsset(detail.efficacy)
        // put target type to fourth position
        if (detail.efficacy.skillTarget?.isOpponent) {
          iconParts[3] = "opponent"
        } else if (GameSetting.skillEfficacyTypeWeaknessDownList.includes(detail.efficacy.type)) {
          iconParts[3] = "negative"
        } else {
          iconParts[3] = "neutral"
        }
      } else if (!iconParts[0]) {
        iconParts[0] = getEfficacyAsset(detail.efficacy)
      } else if (!iconParts[1]) {
        iconParts[1] = getEfficacyAsset(detail.efficacy)
      }
    })
  }
  return iconParts
}
