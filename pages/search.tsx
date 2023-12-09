import { logEvent } from "firebase/analytics";
import Head from "next/head";
import { useEffect } from "react";
import { analytics } from "../src/firebase/firebase";
import CardSearch from "../components/search/CardSearch";
import { initApi, initCard, initCharacter, initSetting, initSkill } from "../src/api/apiUtils";
import { setInitCard, setInitCharacter, setInitSetting, setInitSkill } from "hoshimi-venus";
import useSWR from "swr";
import { Loading } from "../components/misc/loading";

async function fetchData() {
  initApi()
  const results = await Promise.all([
    await initCard(),
    await initSkill(),
    await initCharacter(),
    await initSetting(),
  ])
  return { props: { results: results } }
}

export default function Search() {
  const { data, error } = useSWR("search", fetchData, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  useEffect(() => {
    logEvent(analytics, "open_cardsearch")
  }, [])

  if (error) {
    console.error(error)
  }

  if (error) return (<div>Failed to load</div>)
  if (!data) return (<Loading />)

  const results = data.props.results

  if (results.every(it => it)) {
    setInitCard(results[0])
    setInitSkill(results[1])
    setInitCharacter(results[2])
    setInitSetting(results[3])
  }

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
