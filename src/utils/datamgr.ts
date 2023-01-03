import { Card, Character } from "hoshimi-venus/out/types/proto/proto_master";
import { getAllRawCard, getRawCard as _getRawCard } from "hoshimi-venus/out/db/dao/card_dao";
import { getCard as _getWapCard } from "hoshimi-venus/out/db/repository/card_repository";
import { getCharacter } from "hoshimi-venus/out/db/dao/character_dao";
import { DATA_ENV } from "../dev_conf";
import { SkillEfficacyType } from "hoshimi-venus/out/types/proto/proto_enum";
import { PrivilegedEfficacyList } from "hoshimi-venus/out/concert/consts/efficacy_list"
import { WapCard } from "hoshimi-venus/out/types/wap/card_waps";
import { UserCard } from "hoshimi-venus/out/types/card_types";
import { getDefaultUserCard as _getDefaultUserCard, getUserCard as _getUserCard } from "hoshimi-venus/out/satomi/card";
import { TransCard } from "hoshimi-venus/out/types/trans_types";

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

export const getWapCard = (id: string): WapCard => {
  if (DATA_ENV === "pkg") {
    return _getWapCard(id)!
  }
  throw new Error("Unimplemented.")
}

export const getDefaultUserCard = (id: string): UserCard => {
  if (DATA_ENV === "pkg") {
    return _getDefaultUserCard(id)
  }
  throw new Error("Unimplemented.")
}

export const getUserCard = (transCard: TransCard): UserCard => {
  if (DATA_ENV === "pkg") {
    return _getUserCard(transCard)
  }
  throw new Error("Unimplemented.")
}

export const getChara = (id: string): Character | undefined => {
  if (DATA_ENV === "pkg") {
    return getCharacter(id)
  }
  throw new Error("Unimplemented.")
}

export const getPrivilegedEfficacyList = (): SkillEfficacyType[] => {
  return PrivilegedEfficacyList
}
