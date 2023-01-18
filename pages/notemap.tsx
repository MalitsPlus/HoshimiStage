import Head from "next/head";
import Venue from "../components/live/Venue";

export default function Notemap() {
  return (
    <div>
      <Head>
        <title>Hoshimi Stage - Notemap</title>
      </Head>
      <div>
        <Venue />
      </div>
    </div>
  )
}
