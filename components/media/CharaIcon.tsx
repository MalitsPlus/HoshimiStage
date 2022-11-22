import { UnstyledButton } from "@mantine/core";
import { AttributeType, CardType } from "hoshimi-venus/out/types/proto/proto_enum";
import ImageAsset from "../misc/ImageAsset";

export default function CharaIcon({ cid, aid, role, attribute, onCharaClick }:
  { cid: string, aid: string, role: CardType, attribute: AttributeType, onCharaClick: (id: string) => void }) {
  const getCardType = (_type: CardType) => {
    switch (_type) {
      case CardType.Appeal: return "icon_scorer_thumbnail"
      case CardType.Technique: return "icon_buffer_thumbnail"
      case CardType.Support: return "icon_supporter_thumbnail"
      default: return "unknown"
    }
  }
  const getCardAttribute = (_attribute: AttributeType) => {
    switch (_attribute) {
      case AttributeType.Dance: return "icon_rarity_dance"
      case AttributeType.Vocal: return "icon_rarity_vocal"
      case AttributeType.Visual: return "icon_rarity_visual"
      default: return "unknown"
    }
  }
  return (
    <>
      <UnstyledButton
        onClick={() => onCharaClick(cid)}
        className="relative border-transparent rounded-md border-orange-400 aspect-square w-14"
      >
        <ImageAsset
          aid={"img_card_thumb_1_" + aid}
          aspect="1"
          className="rounded-md"
        />
        <div className="absolute aspect-square w-4 top-0.5 left-0.5">
          <ImageAsset
            aid={getCardType(role)}
            aspect="1"
            className="z-10"
          />
        </div>
        <div className="absolute aspect-square w-4 bottom-0.5 right-0.5">
          <ImageAsset
            aid={getCardAttribute(attribute)}
            aspect="1"
            className="z-10"
          />
        </div>
      </UnstyledButton>
    </>

  )
}
