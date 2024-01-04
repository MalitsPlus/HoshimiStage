import { setInitCard, setInitCharacter, setInitQuest, setInitSetting, setInitSkill } from "hoshimi-venus";
import Head from "next/head";
import useSWR from "swr";
import { Formations } from "../components/formation/Formations";
import { Loading } from "../components/misc/loading";
import { initApi, initCard, initCharacter, initQuest, initSetting, initSkill } from "../src/api/apiUtils";

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

  const { data, error } = useSWR("notemap", fetchData, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

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
