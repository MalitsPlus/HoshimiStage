import { Card, Character } from "hoshimi-venus/out/types/proto/proto_master";
import { getAllRawCard, getRawCard as _getRawCard } from "hoshimi-venus/out/db/dao/card_dao";
import { getCharacter } from "hoshimi-venus/out/db/dao/character_dao";
import { DATA_ENV } from "../dev_conf";
import { SkillEfficacyType } from "hoshimi-venus/out/types/proto/proto_enum";

// export function getData<T>(func: () => T): T {
//   return func()
// }// export function getData<T>(func: () => T): T {
//   return func()
// }

export const getData = <T extends (...args: any[]) => any>(func: T, ...args: any[]): ReturnType<T> => {
  return func(...args)
}

export const getAllCards = (): Card[] => {
  if (DATA_ENV === "pkg") {
    return getAllRawCard()
  }
  throw new Error("Unimplemented.")
}

export const getRawCard = (id: string): Card => {
  if (DATA_ENV === "pkg") {
    return _getRawCard(id)!
  }
  throw new Error("Unimplemented.")
}

export const getChara = (id: string): Character | undefined => {
  if (DATA_ENV === "pkg") {
    return getCharacter(id)
  }
  throw new Error("Unimplemented.")
}

// FIXME: import { PrivilegedEfficacyList } from "hoshimi-venus/out/concert/consts/efficacy_list"
export const getPrivilegedEfficacyList = (): SkillEfficacyType[] => {
  return [
    SkillEfficacyType.VocalUp,
    SkillEfficacyType.VocalBoost,
    SkillEfficacyType.VocalDown,
    SkillEfficacyType.DanceUp,
    SkillEfficacyType.DanceBoost,
    SkillEfficacyType.DanceDown,
    SkillEfficacyType.VisualUp,
    SkillEfficacyType.VisualBoost,
    SkillEfficacyType.VisualDown,
    SkillEfficacyType.SkillSuccessRateUp,
    SkillEfficacyType.SkillImpossible,
  ]
}
