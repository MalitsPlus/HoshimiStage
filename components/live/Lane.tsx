import { Live } from "hoshimi-venus/out/types/concert_types"
import { AttributeType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { getAttrBgColor, getCardAttribute } from "../../src/utils/misc"
import CharaIcon from "../media/CharaIcon"
import DraggableCharaIcon from "../media/DraggableCharaIcon"

export default function Lane({ card, index, live }: {
  card: Card, index: number, live: Live
}
) {
  const cardId = card.assetId
  const role = card.type
  const attribute = getCardAttribute(card)
  return (
    <div className="flex flex-col h-screen items-center justify-start p-4 border-y-0">
      <DraggableCharaIcon
        cardId={cardId}
        role={role}
        attribute={attribute}
      />
      <p>{cardId}</p>
      <div className={`w-full h-1 rounded-sm ${getAttrBgColor(attribute)}`} />
    </div>
  )
}
