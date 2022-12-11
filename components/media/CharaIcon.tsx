import { UnstyledButton } from "@mantine/core";
import { AttributeType, CardType } from "hoshimi-venus/out/types/proto/proto_enum";
import { memo } from "react";
import ImageAsset from "../misc/ImageAsset";

const CharaIcon = ({ cid, aid, role, attribute, onCharaClick }:
  { cid: string, aid: string, role: CardType, attribute: AttributeType, onCharaClick?: (id: string) => void }) => {
  
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
    <div className="rounded-md aspect-square w-14 h-14">
      <UnstyledButton
        onClick={() => onCharaClick && onCharaClick(cid)}
        className={`relative rounded-md aspect-square w-14 h-14 ${onCharaClick ? "cursor-pointer" : "cursor-default"}`}
      >
        <ImageAsset
          aid={"img_card_thumb_1_" + aid}
          aspect="1"
          className="rounded-md w-14 h-14"
        />
        <div className="absolute aspect-square w-4 top-0 left-0">
          <ImageAsset
            aid={getCardType(role)}
            aspect="1"
            className="z-10"
          />
        </div>
        <div className="absolute aspect-square w-4 bottom-0 right-0">
          <ImageAsset
            aid={getCardAttribute(attribute)}
            aspect="1"
            className="z-10"
          />
        </div>
      </UnstyledButton>
    </div>

  )
}

export default memo(CharaIcon)
