import { IconFilter } from "@tabler/icons"
import {
  AttributeType, CardType, SkillCategoryType, SkillEfficacyType,
  SkillTargetType, SkillTriggerType
} from "hoshimi-venus/out/types/proto/proto_enum"
import { t } from "i18next"
import { useState } from "react"
import { IconButton } from "../misc/IconButton"
import SearchOptions from "./SearchOptions"
import SearchResults from "./SearchResults"
import { targetTypesPresets, triggerTypesPresets } from "./searchOptionsPresets"

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

  const setAndRefreshPage: typeof setOpts = (
    _: Parameters<typeof setOpts>[0]
  ) => {
    setOpts(_)
    setPage(1)
  }

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
        <div className={
          `${opened ? "block" : "hidden"} 
          fixed z-30 top-0 left-0 right-0 w-screen h-screen p-4 bg-white dark:bg-[--mantine-color-dark-7] 
          lg:static lg:z-0 lg:flex-none lg:w-[360px] lg:p-0 lg:h-fit lg:block lg:pl-4`
        }>
          <SearchOptions
            opts={opts}
            setOpts={setAndRefreshPage}
          />
        </div>
      </div>
      <div className="lg:hidden">
        <div className="fixed z-40 bottom-12 right-0 w-12 h-12">
          <IconButton
            floatingPosition="top-end"
            icon={IconFilter}
            iconSize={32}
            label={t("Filter") as string}
            className="w-12 h-12 bg-blue-100/70 dark:bg-zinc-700/70 hover:bg-blue-100/70 dark:hover:bg-zinc-700/70"
            onClick={() => setOpened(o => !o)}
          />
        </div>
      </div>
    </>
  )
}
