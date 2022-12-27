import { SkillCategoryType } from "hoshimi-venus/out/types/proto/proto_enum";
import { WapSkillLevel } from "hoshimi-venus/out/types/wap/skill_waps";

export function getSkillAssetId(
  skill: WapSkillLevel
): string {
  if (skill.categoryType === SkillCategoryType.Special) {
    return "img_icon_skill_" + skill.assetId
  }
  
}