import { MusicPath } from "../../src/utils/resmgr";

import ImageAsset from "../misc/ImageAsset";

export default function MusicCover({ aid }: { aid: string }) {
  return (
    <div className="aspect-square w-8 h-8">
      <ImageAsset
        src={MusicPath(aid)}
        alt={aid}
      />
    </div>
  )
}
