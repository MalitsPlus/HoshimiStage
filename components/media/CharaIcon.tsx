import { UnstyledButton } from "@mantine/core";
import { AttributeType, CardType } from "hoshimi-venus/out/types/proto/proto_enum";
import { getAttrBgColor } from "../../src/utils/misc";
import ImageAsset from "../misc/ImageAsset";

export default function CharaIcon({ cardId, role, attribute, onClick }:
  { cardId: string, role: CardType, attribute: AttributeType, onClick?: () => void }) {
  const getCardType = (_type: CardType) => {
    switch (_type) {
      case CardType.Appeal: return "scorer"
      case CardType.Technique: return "buffer"
      case CardType.Support: return "supporter"
      default: return "unknown"
    }
  }
  return (
    <>
      <UnstyledButton
        onClick={onClick}
        className="relative border-transparent rounded-md border-orange-400 aspect-square w-14"
      >
        <ImageAsset
          aid={cardId}
          aspect="1"
          className="rounded-md -z-50"
        />
        <div className="absolute aspect-square w-3 top-1 left-1">
          <ImageAsset
            aid={getCardType(role)}
            aspect="1"
            className="z-10"
          />
        </div>
        <div className="absolute aspect-square w-3 bottom-1 right-1">
          <ImageAsset
            aid="star"  // FIXME
            aspect="1"
            className={`z-10 ${getAttrBgColor(attribute)}`}
          />
        </div>
      </UnstyledButton>
    </>

  )
}
