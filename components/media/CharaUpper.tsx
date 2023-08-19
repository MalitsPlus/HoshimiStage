import { UnstyledButton } from "@mantine/core";
import { AttributeType, CardType } from "hoshimi-venus/out/types/proto/proto_enum";
import { memo } from "react";
import ImageAsset from "../misc/ImageAsset";

type CharaUpperProps = {
  pointer: boolean,
  id?: string,
  assetId?: string,
  role?: CardType,
  attribute?: AttributeType,
  onCharaClick?: () => void,
}

const CharaUpper = ({
  pointer,
  id,
  assetId,
  role,
  attribute,
  onCharaClick
}: CharaUpperProps) => {
  if (assetId === undefined || role === undefined || attribute === undefined) {
    return (
      <div className="aspect-auto w-32 h-64">
        <UnstyledButton
          onClick={onCharaClick}
          className={`relative aspect-auto w-32 h-64 ${pointer ? "cursor-pointer" : "cursor-default"}`}
        >
          <ImageAsset
            aid="chara_icon_placeholder"
            aspect="1/2"
            env="local"
            className="w-32 h-64"
          />
        </UnstyledButton>
      </div>
    )
  }
  const getCardType = (_type: CardType) => {
    switch (_type) {
      case CardType.Appeal: return "icon_scorer_thumbnail_32"
      case CardType.Technique: return "icon_buffer_thumbnail_32"
      case CardType.Support: return "icon_supporter_thumbnail_32"
      default: return "unknown"
    }
  }
  const getCardAttribute = (_attribute: AttributeType) => {
    switch (_attribute) {
      case AttributeType.Dance: return "icon_rarity_dance_32"
      case AttributeType.Vocal: return "icon_rarity_vocal_32"
      case AttributeType.Visual: return "icon_rarity_visual_32"
      default: return "unknown"
    }
  }
  return (
    <div className="aspect-auto w-32 h-64">
      <UnstyledButton
        onClick={onCharaClick}
        className={`relative aspect-auto w-32 h-64 ${pointer ? "cursor-pointer" : "cursor-default"}`}
      >
        <ImageAsset
          aid={"img_card_upper_1_" + assetId}
          aspect="1/2"
          className="w-32 h-64"
        />
        <div className="absolute aspect-square w-6 top-0 left-0">
          <ImageAsset
            aid={getCardType(role)}
            aspect="1"
            env="local"
            className="z-10"
          />
        </div>
        <div className="absolute aspect-square w-6 bottom-0 right-0">
          <ImageAsset
            aid={getCardAttribute(attribute)}
            aspect="1"
            env="local"
            className="z-10"
          />
        </div>
      </UnstyledButton>
    </div>
  )
}

export default memo(CharaUpper)
