import Image, { ImageProps } from "next/image";
import { getAssetUri } from "../../src/utils/resmgr";

export default function ImageAsset(
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
      <Image
        src={getAssetUri("image", aid)}
        alt={aid}
        fill
        className="object-fill"
        {...others}
      />
    </div >

  )
}
