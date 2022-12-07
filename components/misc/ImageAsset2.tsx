import Image, { ImageProps } from "next/image";
import { getAssetUri } from "../../src/utils/resmgr";

const PLACEHOLDER_SVG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOs3/a/HgAGpQK1AGcMqQAAAABJRU5ErkJggg=='

export default function ImageAsset2(
  props: {
    aid: string,
  } & Partial<ImageProps>
) {
  const { aid, ...others } = props
  return (
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
  )
}
