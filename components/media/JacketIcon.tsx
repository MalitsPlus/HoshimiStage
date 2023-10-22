import { Tooltip, UnstyledButton } from "@mantine/core"
import { Music } from "hoshimi-venus/out/types/proto/proto_master"
import ImageAsset from "../misc/ImageAsset"
import { getMusicJacket } from "../../src/utils/misc"

export function JacketIcon({
  id,
  assetId,
  className,
  name,
  singer,
  onClick,
  tooltip,
}: Pick<Music, "id" | "assetId"> &
  Partial<Pick<Music, "name" | "singer">> & {
    className: string,
    onClick?: (id: string) => void,
    tooltip?: boolean,
  }) {
  const innerJacket = (
    <div className={className}>
      <UnstyledButton
        onClick={() => {
          onClick && onClick(id)
        }}
        className={`relative aspect-auto w-full h-full ${onClick ? "cursor-pointer" : "cursor-default"}`}
      >
        <ImageAsset
          aid={assetId === "" ? "chara_icon_placeholder" : getMusicJacket(assetId)}
          env={assetId === "" ? "local" : "remote"}
          aspect="1"
        />
      </UnstyledButton>
    </div>
  )
  return tooltip
    ? (
      <Tooltip
        multiline
        zIndex={99999}
        position="top"
        transitionProps={{ transition: 'pop', duration: 200 }}
        label={<div className="text-center">{name}<br />{singer}</div>}
      >
        {innerJacket}
      </Tooltip>
    )
    : innerJacket
}
