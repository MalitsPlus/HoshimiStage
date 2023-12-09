import { logEvent } from "firebase/analytics";
import Head from "next/head";
import { useEffect } from "react";
import { analytics } from "../src/firebase/firebase";
import { Formations } from "../components/formation/Formations";
import { initApi, initCard, initCharacter, initQuest, initSetting, initSkill } from "../src/api/apiUtils";
import { setInitCard, setInitCharacter, setInitQuest, setInitSetting, setInitSkill } from "hoshimi-venus";
import useSWR from "swr";
import { Loading } from "../components/misc/loading";

async function fetchData() {
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

export default function Formation() {

  const { data, error } = useSWR("search", fetchData, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  useEffect(() => {
    logEvent(analytics, "open_formation")
  }, [])

  if (error) return (<div>Failed to load</div>)
  if (!data) return (<Loading />)

  const results = data.props.results

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
        <title>Hoshimi Stage - Formation</title>
      </Head>
      <div>
        <Formations />
      </div>
    </div>
  )
}
