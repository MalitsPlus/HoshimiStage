import Head from "next/head";
import Venue from "../components/live/Venue";
import ImageAsset from "../components/misc/ImageAsset";

export default function Notemap() {
  return (
    <div>
      <Head>
        <title>SakuraLove - Notemap</title>
      </Head>
      <div>
        <Venue />
        {/* <div>
          <ImageAsset
            aid="unit-003"
            aspect="1"
            height={64}
          />
        </div>
        <div>
          this is contents
        </div> */}
      </div>
    </div>
  )
}
