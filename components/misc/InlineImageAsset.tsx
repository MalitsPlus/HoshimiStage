import Image, { ImageProps } from "next/image";
import { getAssetUri } from "../../src/utils/resmgr";
import ImageAsset2 from "./ImageAsset2";

const PLACEHOLDER_SVG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOs3/a/HgAGpQK1AGcMqQAAAABJRU5ErkJggg=='

export default function InlineImageAsset(
  props: {
    aid: string,
    aspect: string,
  } & Partial<ImageProps>
) {
  const { aid, aspect, width, height, ...others } = props
  return (
    <div
      className="relative"
      style={{
        aspectRatio: aspect,
        height: height,
        width: width,
      }}
    >
      <ImageAsset2 aid={aid} {...others} />
    </div >
  )
}
