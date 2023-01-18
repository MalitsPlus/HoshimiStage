import Image, { ImageProps } from "next/image";
import { memo } from "react";
import { getAssetUri } from "../../src/utils/res_mgr";

const PLACEHOLDER_SVG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOs3/a/HgAGpQK1AGcMqQAAAABJRU5ErkJggg=='

const ImageAsset = (
  props: {
    aid: string,
    aspect: string,
    env?: "local" | "remote",
  } & Partial<ImageProps>
) => {
  const { aid, aspect, width, height, env, ...others } = props
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
        src={getAssetUri("image", aid, env)}
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

export default memo(ImageAsset)
