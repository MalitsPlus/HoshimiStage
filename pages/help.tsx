import { logEvent } from "firebase/analytics";
import Head from "next/head";
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
      <div>
        this is about page.
      </div>
    </>
  )
}
