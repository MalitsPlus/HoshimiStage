import { Card, Character } from "hoshimi-venus/out/types/proto/proto_master";
import { getAllRawCard } from "hoshimi-venus/out/db/dao/card_dao";
import { getCharacter } from "hoshimi-venus/out/db/dao/character_dao";
import { DATA_ENV } from "../dev_conf";

// export function getData<T>(func: () => T): T {
//   return func()
// }// export function getData<T>(func: () => T): T {
//   return func()
// }

export const getData = <T extends (...args: any) => any>(func: T): ReturnType<T> => {
  return func()
}

export const getAllCards = (): Card[] => {
  if (DATA_ENV === "pkg") {
    return getAllRawCard()
  }
  throw new Error("Unimplemented.")
}

export const getChara = (id: string): Character => {
  if (DATA_ENV === "pkg") {
    return getCharacter(id)!  // FIXME
  }
  throw new Error("Unimplemented.")
}
