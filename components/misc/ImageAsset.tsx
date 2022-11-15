import Image, { ImageProps } from "next/image";

export default function ImageAsset(
  props: {

  } & ImageProps
) {
  const { src, alt } = props
  return (
    <Image
      src={src}
      alt={alt}
      fill
    />
  )
}
