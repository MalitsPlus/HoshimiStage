import * as jose from 'jose'

const BACKEND_URL = "https://hoshimi-backend.vibbit.me"
const PATH = {
  list: "/formation/list",
  add: "/formation/add",
}

export type TFormation = {
  user: string,
  musicId: string,
  chartPatternId: string,
  mainAttr: "Dance" | "Vocal" | "Visual" | "Unknown",
  isBattle: boolean,
  needPhotos: boolean,
  reliability: "Barely" | "Medium" | "Solid",
  indexes: {
    index: number,
    inGamePosition: number,
    attribute: "Dance" | "Vocal" | "Visual" | "Unknown",
    cardId?: string,
    comment: string,
    isMainScorer: boolean,
  }[],
  estimatedScore?: number,
  comment?: string,
  time: number
}

export type TFormationM = {
  _id: string,
} & TFormation

const genJWT = async () => {
  const secret = new TextEncoder().encode("Hoshimi Stage")
  const alg = "HS256"
  const jwt = await new jose.SignJWT({
    "kwskskr": "kanzenfukkatu"
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:hsmstg:issuer")
    .setAudience("urn:hsmbck:issuer")
    .setExpirationTime('2h')
    .sign(secret)
  return jwt
}

const getOption = async (method: "GET" | "POST") => {
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${await genJWT()}`
  }
  if (method === "POST") {
    headers["content-type"] = "application/json;charset=UTF-8"
  }
  return {
    method: method,
    headers: headers,
  }
}

export async function addFormation(formation: TFormation) {
  try {
    const option = await getOption("POST")
    const response = await fetch(BACKEND_URL + PATH.add, {
      ...option,
      body: JSON.stringify(formation)
    })
    if (response.status !== 200) {
      throw Error(`Status: ${response.status}. Msg: ${await response.text()}.`)
    }
    const resJson = await response.json()
    if (resJson.ok !== true) {
      throw Error(`Status: ${response.status}. Msg: ${await response.text()}.`)
    }
    return true
  } catch (error: any) {
    console.error(error.message)
    return false
  }
}

export async function listFormations(params?: Record<string, string>) {
  try {
    const option = await getOption("GET")
    const url = params
      ? BACKEND_URL + PATH.list + "?" + new URLSearchParams(params)
      : BACKEND_URL + PATH.list
    const response = await fetch(url, option)
    if (response.status !== 200) {
      throw Error(`Status: ${response.status}. Msg: ${await response.text()}.`)
    }
    const resJson = <TFormationM[]>await response.json()
    return resJson
  } catch (error: any) {
    console.error(error.message)
    return null
  }
}
