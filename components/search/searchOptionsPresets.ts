import { GameSetting } from "hoshimi-venus/out/db/repository/setting_repository";
import { SkillTargetType, SkillTriggerType } from "hoshimi-venus/out/types/proto/proto_enum";

export const targetTypesPresets = {
  self: [
    SkillTargetType.Self,
    SkillTargetType.All,
  ],
  others: [
    SkillTargetType.All,
    SkillTargetType.CardType,
    SkillTargetType.Center,
    SkillTargetType.Dance,
    SkillTargetType.DanceHigher,
    SkillTargetType.DanceLower,
    SkillTargetType.Neighbor,
    SkillTargetType.PositionAttributeDance,
    SkillTargetType.PositionAttributeVisual,
    SkillTargetType.PositionAttributeVocal,
    SkillTargetType.StaminaHigher,
    SkillTargetType.StaminaLower,
    SkillTargetType.Status,
    SkillTargetType.Visual,
    SkillTargetType.VisualHigher,
    SkillTargetType.VisualLower,
    SkillTargetType.Vocal,
    SkillTargetType.VocalHigher,
    SkillTargetType.VocalLower,
    SkillTargetType.Trigger,
  ],
  opponents: [
    SkillTargetType.OpponentAll,
    SkillTargetType.OpponentCardType,
    SkillTargetType.OpponentCenter,
    SkillTargetType.OpponentSamePosition,
  ],
  nobody: [
    SkillTargetType.Unknown,
  ]
}

export const triggerTypesPresets = {
  conditionless: [
    SkillTriggerType.Unknown,
  ],
  practicallyConditionless: [
    SkillTriggerType.Unknown,
    SkillTriggerType.Beat,
    SkillTriggerType.BeforeCritical,
    SkillTriggerType.BeforeCriticalBySomeone,
  ],
  staticConditions: [
    SkillTriggerType.AllAttributeType,
    SkillTriggerType.Center,
    SkillTriggerType.FanEngageHigher,
    SkillTriggerType.LiveStart,
    SkillTriggerType.MoreThanCharacterCount,
    SkillTriggerType.MoreThanPositionCardTypeCount,
    SkillTriggerType.MostLeft,
    SkillTriggerType.MostRight,
    SkillTriggerType.Music,
    SkillTriggerType.PositionAttributeDance,
    SkillTriggerType.PositionAttributeVisual,
    SkillTriggerType.PositionAttributeVocal,
    SkillTriggerType.SecondFromLeft,
    SkillTriggerType.SecondFromRight,
  ],
  dynamicConditions: [
    SkillTriggerType.Combo,
    SkillTriggerType.ComboLessEqual,
    SkillTriggerType.Critical,
    SkillTriggerType.MoodType,
    SkillTriggerType.SkillFailure,
    SkillTriggerType.SkillFailureSelf,
    SkillTriggerType.SomeoneRecovered,
    SkillTriggerType.SomeoneStaminaLower,
    SkillTriggerType.SomeoneStatus,
    SkillTriggerType.SomeoneStatusEffectGradeHigher,
    SkillTriggerType.SomeoneStatusGroup,
    SkillTriggerType.StaminaHigher,
    SkillTriggerType.StaminaLower,
    SkillTriggerType.Status,
    SkillTriggerType.StatusEffectGradeHigher,
    SkillTriggerType.StatusEffectGradeLower,
    SkillTriggerType.StatusGroup,
  ],
  beforeSth: [
    SkillTriggerType.BeforeActiveSkill,
    SkillTriggerType.BeforeActiveSkillBySomeone,
    SkillTriggerType.BeforeSpecialSkill,
    SkillTriggerType.BeforeSpecialSkillBySomeone,
  ],
  unimplemented: [
    SkillTriggerType.AllAttributeType,
    SkillTriggerType.AllStatus,
    SkillTriggerType.CardTypeStatus,
    SkillTriggerType.CenterStatus,
  ]
}

export const ScoringEfficacies = GameSetting.skillEfficacyTypeScoreList
