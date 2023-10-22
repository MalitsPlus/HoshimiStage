import { logEvent } from "firebase/analytics";
import Head from "next/head";
import { useEffect } from "react";
import { analytics } from "../src/firebase/firebase";
import { Formations } from "../components/formation/Formations";

export default function Formation() {
  useEffect(() => {
    logEvent(analytics, "open_formation")
  }, [])
  return (
    <div>
      <Head>
        <title>Hoshimi Stage - Formation</title>
      </Head>
      <div>
        <Formations />
      </div>
    </div>
  )
}
