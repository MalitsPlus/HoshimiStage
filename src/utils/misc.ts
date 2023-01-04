import { AttributeType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { AllyParty } from "../../components/live/Stage"

export const getMusicJacket = (musicId: string): string => {
  const id = musicId.match(/\w+-\d+$/)
  return `img_music_jacket_${id}`
}

export const getAttrBgColor = (attr: AttributeType) => {
  switch (attr) {
    case AttributeType.Vocal: return "bg-vocal"
    case AttributeType.Dance: return "bg-dance"
    case AttributeType.Visual: return "bg-visual"
    default: return "bg-zinc-400"
  }
}

const cardAttributeRepo: {
  [id: string]: AttributeType
} = {}

export function getCardAttribute(
  card: Pick<
    Card,
    'vocalRatioPermil' | 'danceRatioPermil' | 'visualRatioPermil' | 'id'
  >
): AttributeType {
  const { vocalRatioPermil, danceRatioPermil, visualRatioPermil, id } = card
  let attr = cardAttributeRepo[id]
  if (attr) {
    return attr
  }
  if (
    vocalRatioPermil > danceRatioPermil &&
    vocalRatioPermil > visualRatioPermil
  ) {
    attr = AttributeType.Vocal
  } else if (
    danceRatioPermil > vocalRatioPermil &&
    danceRatioPermil > visualRatioPermil
  ) {
    attr = AttributeType.Dance
  } else if (
    visualRatioPermil > vocalRatioPermil &&
    visualRatioPermil > danceRatioPermil
  ) {
    attr = AttributeType.Visual
  }
  cardAttributeRepo[id] = attr
  return attr
}

export const isCardInParty = (card: Card, party: AllyParty): boolean => {
  return isIdInParty(card.id, party)
}

export const isIdInParty = (id: string, party: AllyParty): boolean => {
  return Object.values(party).some(it => it.cardId === id)
}

export const isPartyFull = (party: AllyParty): boolean => {
  return Object.values(party).every(it => !!it.cardId)
}
