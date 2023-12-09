import { logEvent } from "firebase/analytics";
import Head from "next/head";
import { useEffect } from "react";
import Venue from "../components/live/Venue";
import { analytics } from "../src/firebase/firebase";
import {
  initApi,
  initCard,
  initCharacter,
  initQuest,
  initSetting,
  initSkill
} from "../src/api/apiUtils";
import { InferGetServerSidePropsType } from "next";
import { setInitCard, setInitCharacter, setInitQuest, setInitSetting, setInitSkill } from "hoshimi-venus";

export async function getServerSideProps() {
  initApi()
  const results = await Promise.all([
    await initCard(),
    await initSkill(),
    await initCharacter(),
    await initSetting(),
    await initQuest(),
  ])
  return { props: { results: results } }
}

export default function Notemap({ results }:
  InferGetServerSidePropsType<typeof getServerSideProps>
) {
  useEffect(() => {
    logEvent(analytics, "open_notemap")
  }, [])

  if (results.every(it => it)) {
    setInitCard(results[0])
    setInitSkill(results[1])
    setInitCharacter(results[2])
    setInitSetting(results[3])
    setInitQuest(results[4])
  }

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
