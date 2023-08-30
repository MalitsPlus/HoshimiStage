import { logEvent } from "firebase/analytics";
import Head from "next/head";
import { useEffect } from "react";
import { analytics } from "../src/firebase/firebase";
import CardSearch from "../components/search/CardSearch";

export default function Search() {
  useEffect(() => {
    logEvent(analytics, "open_cardsearch")
  }, [])
  return (
    <div>
      <Head>
        <title>Hoshimi Stage - Card Search</title>
      </Head>
      <div>
        <CardSearch />
      </div>
    </div>
  )
}
