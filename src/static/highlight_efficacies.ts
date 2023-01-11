import { GameSetting } from "hoshimi-venus/out/db/repository/setting_repository";
import { SkillEfficacyType } from "hoshimi-venus/out/types/proto/proto_enum";

export const HighlightEfficacies = [
  ...GameSetting.skillEfficacyTypeWeaknessDownList,
  ...GameSetting.skillEfficacyTypeWeaknessOtherList,
  SkillEfficacyType.DanceBoost,
  SkillEfficacyType.DanceUp,
  SkillEfficacyType.VocalBoost,
  SkillEfficacyType.VocalUp,
  SkillEfficacyType.VisualBoost,
  SkillEfficacyType.VisualUp,
  SkillEfficacyType.ScoreUp,
  SkillEfficacyType.ActiveSkillScoreUp,
  SkillEfficacyType.SpecialSkillScoreUp,
  SkillEfficacyType.CriticalRateUp,
  SkillEfficacyType.CriticalBonusPermilUp,
  SkillEfficacyType.SpecialScoreMultiplierAdd,
  SkillEfficacyType.ActiveScoreMultiplierAdd,
  SkillEfficacyType.ComboScoreUp,
  SkillEfficacyType.SkillSuccessRateUp,
  SkillEfficacyType.TensionUp,
  SkillEfficacyType.AudienceAmountIncrease,
]