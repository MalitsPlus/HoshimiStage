import { Card } from "hoshimi-venus/out/types/proto/proto_master";
import { TransCard } from "hoshimi-venus/out/types/trans_types";

export const getDefaultTransCard = (card: Card, ingameIndex: number): TransCard => {
  return {
    index: ingameIndex,
    cardId: card.id,
    level: 190,
    rarity: 10,
    skillLevel1: 4,
    skillLevel2: 4,
    skillLevel3: 2,
    isArbitrary: false,
    mental: 5000,
    technique: 8000,
    dance: 0,
    vocal: 0,
    visual: 0,
    stamina: 0,
  }
}
