import { logEvent } from "firebase/analytics";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { analytics } from "../src/firebase/firebase";

export default function Help() {
  useEffect(() => {
    logEvent(analytics, "open_help")
  }, [])
  return (
    <>
      <Head>
        <title>Hoshimi Stage - Help</title>
      </Head>
      <p>
        Under construction.
      </p>
      <p>
        Open source homepage: <Link href="https://github.com/MalitsPlus/HoshimiStage">https://github.com/MalitsPlus/HoshimiStage</Link>
      </p>
      <p>
        License: Apache-2.0 license
      </p>
      <p>
        {"Disclaimer: This is a fan-made website and has no connection with the official affiliation. The copyright of ingame data & assets are belong to QualiArts, Inc."}
      </p>
    </>
  )
}
