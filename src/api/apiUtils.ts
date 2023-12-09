import {
  initCard as _initCard,
  initCharacter as _initCharacter,
  initQuest as _initQuest,
  initSetting as _initSetting,
  initSkill as _initSkill,
  init as _initApi,
} from "hoshimi-venus";
import { groupPresets, setGroupPresets } from "../../components/search/searchOptionsPresets";
import { getAllGroups } from "hoshimi-venus/out/db/repository/chara_repository";

type ArgumentType<F extends Function> = F extends (arg: infer A) => any ? A : never

export function initApi() {
  if (process.env.NEXT_PUBLIC_DB_URL && process.env.NEXT_PUBLIC_DB_SKR) {
    _initApi({
      url: process.env.NEXT_PUBLIC_DB_URL,
      sakura: process.env.NEXT_PUBLIC_DB_SKR,
    })
  }
}

export async function initCard() {
  return await _initCard()
}

export async function initSkill() {
  return await _initSkill()
}
export async function initCharacter() {
  const results = await _initCharacter()
  if (groupPresets.length === 0) {
    setGroupPresets(
      getAllGroups().map(g => ({
        id: g.assetId,
        name: g.name,
        charas: g.mappings.map(c => c.characterId),
      }))
    )
  }
  return results
}

export async function initSetting() {
  return await _initSetting()
}
export async function initQuest() {
  return await _initQuest()
}



export function getSafeObject<T>(
  f: (...args: any) => T,
  name: string,
): ReturnType<typeof f> {
  const savedObj = safeObjects[name]
  // if object is already saved
  if (savedObj !== undefined) {
    return savedObj as T
  }
  try {
    const result = f()
    safeObjects[name] = result
    return result
  } catch {
    return [] as T
  }
}

const safeObjects: {
  [key: string]: any
} = {}
