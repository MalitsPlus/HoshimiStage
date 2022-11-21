import { AttributeType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"

export const getAttrBgColor = (attr: AttributeType) => {
  switch (attr) {
    case AttributeType.Vocal: return "bg-vocal"
    case AttributeType.Dance: return "bg-dance"
    case AttributeType.Visual: return "bg-visual"
    default: return "bg-zinc-400"
  }
}

export function getCardAttribute(
  card: Pick<
    Card,
    'vocalRatioPermil' | 'danceRatioPermil' | 'visualRatioPermil'
  >
): AttributeType {
  const { vocalRatioPermil, danceRatioPermil, visualRatioPermil } = card
  if (
    vocalRatioPermil > danceRatioPermil &&
    vocalRatioPermil > visualRatioPermil
  ) {
    return AttributeType.Vocal
  }
  if (
    danceRatioPermil > vocalRatioPermil &&
    danceRatioPermil > visualRatioPermil
  ) {
    return AttributeType.Dance
  }
  if (
    visualRatioPermil > vocalRatioPermil &&
    visualRatioPermil > danceRatioPermil
  ) {
    return AttributeType.Visual
  }
  return AttributeType.Unknown
}
