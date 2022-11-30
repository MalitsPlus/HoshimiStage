import Image, { ImageProps } from "next/image";
import { getAssetUri } from "../../src/utils/resmgr";

const PLACEHOLDER_SVG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOs3/a/HgAGpQK1AGcMqQAAAABJRU5ErkJggg=='

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
        sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        placeholder="blur"
        blurDataURL={PLACEHOLDER_SVG}
        {...others}
      />
    </div >

  )
}
