import {
  AttributeType, CardType, SkillCategoryType, SkillEfficacyType,
  SkillTargetType, SkillTriggerType
} from "hoshimi-venus/out/types/proto/proto_enum"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import SearchOptions from "./SearchOptions"
import SearchResults from "./SearchResults"
import { targetTypesPresets, triggerTypesPresets } from "./searchOptionsPresets"
import { logEvent } from "firebase/analytics"
import { analytics } from "../../src/firebase/firebase"
import dynamic from "next/dynamic"
import { IconButton } from "../misc/IconButton"
import { IconFilter } from "@tabler/icons"
import { t } from "i18next"

export type SkillSearchOpts = {
  cardStars: ("fivestar" | "else")[],
  skillTypes: SkillCategoryType[],
  cardTypes: CardType[],
  cardAttributes: AttributeType[],
  efficacyTypes: SkillEfficacyType[],
  targetTypes: (SkillTargetType | keyof typeof targetTypesPresets)[],
  triggerTypes: (SkillTriggerType | keyof typeof triggerTypesPresets)[],
  characters: string[],
}

export default function CardSearch() {

  console.debug("CardSearch rendered")

  const [opened, setOpened] = useState(false)
  const [activePage, setPage] = useState(1)

  const [opts, setOpts] = useState<SkillSearchOpts>({
    cardStars: ["fivestar"],
    skillTypes: [],
    cardTypes: [],
    cardAttributes: [],
    efficacyTypes: [],
    targetTypes: [],
    triggerTypes: [],
    characters: [],
  })

  const setAndRefreshPage: Dispatch<SetStateAction<SkillSearchOpts>> = (
    _: SkillSearchOpts | ((_: SkillSearchOpts) => SkillSearchOpts)
  ) => {
    setOpts(_)
    setPage(1)
  }

  useEffect(() => {
    logEvent(analytics, "open_search")
  }, [])

  return (
    <>
      <div className="flex relative">
        <div className="flex-[1_0_30rem] lg:pl-4">
          <SearchResults
            opts={opts}
            activePage={activePage}
            setPage={setPage}
          />
        </div>
        {!opened && (
          <div className="flex-none w-[360px] hidden lg:block lg:pl-4">
            <SearchOptions
              opts={opts}
              setOpts={setAndRefreshPage}
            />
          </div>
        )}
      </div>
      <div className="lg:hidden">
        <div className="fixed z-40 top-0 right-0 w-12 h-12">
          <IconButton
            floatingPosition="top-end"
            icon={IconFilter}
            iconSize={32}
            label={t("Filter") as string}
            className="w-12 h-12"
            onClick={() => setOpened(o => !o)}
          />
        </div>
        {opened && (
          <div className="fixed z-30 top-0 left-0 right-0 w-screen h-screen bg-zinc-800 lg:hidden">
            <SearchOptions
              opts={opts}
              setOpts={setAndRefreshPage}
              className="px-4"
            />
          </div>
        )}
      </div>
    </>
  )
}
