import {
  AttributeType, CardType, SkillCategoryType, SkillEfficacyType,
  SkillTargetType, SkillTriggerType
} from "hoshimi-venus/out/types/proto/proto_enum"
import { useState } from "react"
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
}

export default function CardSearch() {

  console.debug("CardSearch rendered")

  const [opts, setOpts] = useState<SkillSearchOpts>({
    cardStars: ["fivestar"],
    skillTypes: [],
    cardTypes: [],
    cardAttributes: [],
    efficacyTypes: [],
    targetTypes: [],
    triggerTypes: [],
  })

  return (
    <div className="grid relative" style={{ gridTemplateColumns: "minmax(0.2rem, 2rem) minmax(30rem, 4fr) minmax(0.2rem, 2rem) minmax(10rem, 1fr) minmax(0.2rem, 2rem)" }}>
      <div className="col-start-2">
        <SearchResults
          opts={opts}
        />
      </div>
      <div className="col-start-4">
        <SearchOptions
          opts={opts}
          setOpts={setOpts}
        />
      </div>
    </div>
  )
}
