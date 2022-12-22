import { SkillEfficacyType } from "hoshimi-venus/out/types/proto/proto_enum"

export const EffColor: {
  [type in SkillEfficacyType]?: string
} = {
  [SkillEfficacyType.VocalUp]: "bg-vocal",
  [SkillEfficacyType.VocalBoost]: "bg-vocal",
  [SkillEfficacyType.VocalDown]: "bg-vocal-acc",
  [SkillEfficacyType.DanceUp]: "bg-dance",
  [SkillEfficacyType.DanceBoost]: "bg-dance",
  [SkillEfficacyType.DanceDown]: "bg-dance-acc",
  [SkillEfficacyType.VisualUp]: "bg-visual",
  [SkillEfficacyType.VisualBoost]: "bg-visual",
  [SkillEfficacyType.VisualDown]: "bg-visual-acc",
  [SkillEfficacyType.SkillSuccessRateUp]: "bg-emerald-500",

  [SkillEfficacyType.TargetStaminaRecovery]: "bg-stamina",
  [SkillEfficacyType.StaminaContinuousRecovery]: "bg-stamina",
  [SkillEfficacyType.StaminaConsumptionReduction]: "bg-stamina",
  [SkillEfficacyType.FixStaminaRecovery]: "bg-stamina",
  [SkillEfficacyType.StaminaRecovery]: "bg-stamina",
  [SkillEfficacyType.StaminaConsumptionIncrease]: "bg-stamina-acc",
  [SkillEfficacyType.StaminaContinuousConsumption]: "bg-stamina-acc",
  [SkillEfficacyType.StaminaConsumption]: "bg-stamina-acc",

  [SkillEfficacyType.SkillImpossible]: "bg-red-500",
  [SkillEfficacyType.TensionUp]: "bg-fuchsia-400",
  [SkillEfficacyType.StrengthEffectErasingAll]: "bg-red-500",
  [SkillEfficacyType.StrengthEffectValueIncrease]: "bg-orange-600",
  [SkillEfficacyType.StrengthEffectCountIncrease]: "bg-amber-600",
  [SkillEfficacyType.WeaknessEffectRecovery]: "bg-red-500",
  [SkillEfficacyType.CoolTimeReduction]: "bg-lime-500",
  [SkillEfficacyType.AudienceAmountIncrease]: "bg-pink-700",
  [SkillEfficacyType.AudienceAmountReduction]: "bg-pink-900",

  [SkillEfficacyType.ScoreUp]: "bg-rose-200",
  [SkillEfficacyType.BeatScoreUp]: "bg-rose-300",
  [SkillEfficacyType.ActiveSkillScoreUp]: "bg-rose-400",
  [SkillEfficacyType.SpecialSkillScoreUp]: "bg-rose-500",
  [SkillEfficacyType.ComboScoreUp]: "bg-sky-600",
  [SkillEfficacyType.WeaknessEffectPrevention]: "bg-indigo-800",
  [SkillEfficacyType.StrengthEffectErasing]: "bg-red-600",

  [SkillEfficacyType.SpecialScoreMultiplierAdd]: "bg-purple-500",
  [SkillEfficacyType.ActiveScoreMultiplierAdd]: "bg-purple-400",
  [SkillEfficacyType.PassiveScoreMultiplierAdd]: "bg-purple-300",

  [SkillEfficacyType.CriticalRateUp]: "bg-cyan-200",
  [SkillEfficacyType.CriticalBonusPermilUp]: "bg-cyan-400",
}
