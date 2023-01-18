import { SkillEfficacyType } from "hoshimi-venus/out/types/proto/proto_enum";
import { getPrivilegedEfficacyList } from "../utils/data_mgr";

export const PrivilegedEfficacies = getPrivilegedEfficacyList()

export const HighlightEfficacies = [
  SkillEfficacyType.ScoreUp,
  SkillEfficacyType.ActiveSkillScoreUp,
  SkillEfficacyType.SpecialSkillScoreUp,
  SkillEfficacyType.CriticalRateUp,
  SkillEfficacyType.CriticalBonusPermilUp,
  SkillEfficacyType.SpecialScoreMultiplierAdd,
  SkillEfficacyType.ActiveScoreMultiplierAdd,
  SkillEfficacyType.ComboScoreUp,
  SkillEfficacyType.TensionUp,
  SkillEfficacyType.AudienceAmountIncrease,
]

export const PriviAndHighlightEfficacies = [
  ...PrivilegedEfficacies,
  ...HighlightEfficacies,
]