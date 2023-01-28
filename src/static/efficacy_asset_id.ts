import { SkillEfficacyType } from "hoshimi-venus/out/types/proto/proto_enum";

export const EffIcon: {
  [type in SkillEfficacyType]?: string
} = {
  [SkillEfficacyType.ActiveSkillScoreUp]: "active-skill-score-up",
  [SkillEfficacyType.AudienceAmountIncrease]: "audience-amount-increase",
  [SkillEfficacyType.AudienceAmountReduction]: "audience-amount-reduction",
  [SkillEfficacyType.BeatScoreUp]: "beat-score-up",
  [SkillEfficacyType.ComboContinuation]: "combo-continuation",
  [SkillEfficacyType.ComboScoreUp]: "combo-score-up",
  [SkillEfficacyType.CoolTimeIncrease]: "cool-time-increase",
  [SkillEfficacyType.CoolTimeReduction]: "cool-time-reduction",
  [SkillEfficacyType.CriticalBonusPermilUp]: "critical-bonus-permil-up",
  [SkillEfficacyType.CriticalRateUp]: "critical-rate-up",
  [SkillEfficacyType.DanceBoost]: "dance-boost",
  [SkillEfficacyType.DanceDown]: "dance-down",
  [SkillEfficacyType.DanceUp]: "dance-up",
  [SkillEfficacyType.FixScoreGet]: "fix-score-get",
  [SkillEfficacyType.FixStaminaRecovery]: "fix-stamina-recovery",
  [SkillEfficacyType.PassiveScoreMultiplierAdd]: "passive-score-multiplier-add",
  [SkillEfficacyType.PassiveSkillScoreUp]: "passive-skill-score-up",
  [SkillEfficacyType.ScoreGet]: "score-get",
  [SkillEfficacyType.ScoreGetAndStaminaConsumptionByMoreStaminaUse]: "score-get-and-stamina-consumption-by-more-stamina-use",
  [SkillEfficacyType.ScoreGetByDeckBuffer]: "score-get-by-deck-buffer",
  [SkillEfficacyType.ScoreGetByDeckSupporter]: "score-get-by-deck-supporter",
  [SkillEfficacyType.ScoreGetByLessFanAmount]: "score-get-by-less-fan-amount",
  [SkillEfficacyType.ScoreGetByLessStamina]: "score-get-by-less-stamina",
  [SkillEfficacyType.ScoreGetByMoreComboCount]: "score-get-by-more-combo-count",
  [SkillEfficacyType.ScoreGetByMoreFanAmount]: "score-get-by-more-fan-amount",
  [SkillEfficacyType.ScoreGetByMoreFanEngage]: "score-get-by-more-fan-engage",
  [SkillEfficacyType.ScoreGetByMoreStamina]: "score-get-by-more-stamina",
  [SkillEfficacyType.ScoreGetByMoreStaminaUse]: "score-get-by-more-stamina-use",
  [SkillEfficacyType.ScoreGetBySkillActivationCount]: "score-get-by-skill-activation-count",
  [SkillEfficacyType.ScoreGetBySkillSuccessRateUp]: "score-get-by-skill-success-rate-up",
  [SkillEfficacyType.ScoreGetByStatusEffectTypeGrade]: "score-get-by-status-effect-type-grade",
  [SkillEfficacyType.ScoreGetByStrengthEffectCount]: "score-get-by-strength-effect-count",
  [SkillEfficacyType.ScoreGetByTrigger]: "score-get-by-trigger",
  [SkillEfficacyType.ScoreUp]: "score-up",
  [SkillEfficacyType.SkillImpossible]: "skill-impossible",
  [SkillEfficacyType.SkillSuccessRateUp]: "skill-success-rate-up",
  [SkillEfficacyType.SpecialScoreMultiplierAdd]: "special-score-multiplier-add",
  [SkillEfficacyType.SpecialSkillScoreUp]: "special-skill-score-up",
  [SkillEfficacyType.StaminaConsumption]: "stamina-consumption",
  [SkillEfficacyType.StaminaConsumptionIncrease]: "stamina-consumption-increase",
  [SkillEfficacyType.StaminaConsumptionReduction]: "stamina-consumption-reduction",
  [SkillEfficacyType.StaminaContinuousConsumption]: "stamina-continuous-consumption",
  [SkillEfficacyType.StaminaContinuousRecovery]: "stamina-continuous-recovery",
  [SkillEfficacyType.StaminaRecovery]: "stamina-recovery",
  [SkillEfficacyType.StrengthEffectAssignment]: "strength-effect-assignment",
  [SkillEfficacyType.StrengthEffectAssignmentAll]: "strength-effect-assignment-all",
  [SkillEfficacyType.StrengthEffectCountIncrease]: "strength-effect-count-increase",
  [SkillEfficacyType.StrengthEffectErasing]: "strength-effect-erasing",
  [SkillEfficacyType.StrengthEffectErasingAll]: "strength-effect-erasing-all",
  [SkillEfficacyType.StrengthEffectMigrationBeforeActiveSkill]: "strength-effect-migration-before-active-skill",
  [SkillEfficacyType.StrengthEffectMigrationBeforeSpecialSkill]: "strength-effect-migration-before-special-skill",
  [SkillEfficacyType.StrengthEffectValueIncrease]: "strength-effect-value-increase",
  [SkillEfficacyType.TargetStaminaRecovery]: "target-stamina-recovery",
  [SkillEfficacyType.TensionUp]: "tension-up",
  [SkillEfficacyType.VisualBoost]: "visual-boost",
  [SkillEfficacyType.VisualDown]: "visual-down",
  [SkillEfficacyType.VisualUp]: "visual-up",
  [SkillEfficacyType.VocalBoost]: "vocal-boost",
  [SkillEfficacyType.VocalDown]: "vocal-down",
  [SkillEfficacyType.VocalUp]: "vocal-up",
  [SkillEfficacyType.WeaknessEffectInversion]: "weakness-effect-inversion",
  [SkillEfficacyType.WeaknessEffectPrevention]: "weakness-effect-prevention",
  [SkillEfficacyType.WeaknessEffectRecovery]: "weakness-effect-recovery",
  [SkillEfficacyType.ActiveSkillChanceAssignment]: "active-skill-chance-assignment",
}
