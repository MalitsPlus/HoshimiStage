import { Chip, Divider } from "@mantine/core"
import { AttributeType, CardType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { t } from "i18next"
import { ImageProps } from "next/image"
import { useMemo, useReducer } from "react"
import { getAllCards, getData } from "../../src/utils/datamgr"
import { getCardAttribute } from "../../src/utils/misc"
import CharaIcon from "../media/CharaIcon"
import CharaIconDropZone from "../media/CharaIconDropZone"
import DraggableCharaIcon from "../media/DraggableCharaIcon"
import ImageAsset from "../misc/ImageAsset"
import MyButton from "../misc/MyButton"

type TState = {
  starChips: string[],
  typeChips: string[],
  attrChips: string[],
}

function reducer(state: TState, action: any): TState {
  switch (action.type) {
    case "star":
      return {
        ...state,
        starChips: action.starChips,
      }
    case "type":
      return {
        ...state,
        typeChips: action.typeChips,
      }
    case "attr":
      return {
        ...state,
        attrChips: action.attrChips,
      }
    case "all":
      return {
        starChips: action.starChips,
        typeChips: action.typeChips,
        attrChips: action.attrChips,
      }
    default: return state
  }
}

function cardFilter(card: Card, state: TState): boolean {
  const rarity = !!!state.starChips.length
    || card.initialRarity === 5 && state.starChips.includes("fivestar")
    || card.initialRarity !== 5 && state.starChips.includes("else")
  const type = !!!state.typeChips.length
    || card.type === CardType.Appeal && state.typeChips.includes("scorer")
    || card.type === CardType.Technique && state.typeChips.includes("buffer")
    || card.type === CardType.Support && state.typeChips.includes("supporter")
  const attr = !!!state.attrChips.length
    || getCardAttribute(card) === AttributeType.Dance && state.attrChips.includes("dance")
    || getCardAttribute(card) === AttributeType.Vocal && state.attrChips.includes("vocal")
    || getCardAttribute(card) === AttributeType.Visual && state.attrChips.includes("visual")
  return rarity && type && attr
}

export default function Greenroom({
  party,
  setParty,
}: {
  party: Card[],
  setParty: (pt: Card[]) => void,
}) {
  const [state, dispatch] = useReducer(reducer, { starChips: ["fivestar"], typeChips: [], attrChips: [] })
  const allCards = useMemo(() => {
    return getData(getAllCards)
  }, [])

  const IconChip = ({ name, iconAid }: {
    name: string, iconAid: string
  } & Partial<ImageProps>) => {
    return (
      <Chip value={name}>
        <div className="relative aspect-square w-4 mr-0.5 inline-block align-[-3px]">
          <ImageAsset aid={iconAid} aspect="1" />
        </div>
        <span>{t(name)}</span>
      </Chip>
    )
  }

  return (
    <>
      <div className="flex flex-row gap-4">
        <div>
          <div>
            <MyButton onClick={() => { dispatch({ starChips: [], typeChips: [], attrChips: [], type: "all" }) }}>
              {t("clear")}
            </MyButton>
          </div>
          <div>
            <Divider my="md" label={t("Initial Rarity")} />
            <Chip.Group value={state.starChips} onChange={v => { dispatch({ starChips: v, type: "star" }) }} multiple>
              <IconChip name="fivestar" iconAid="icon_rarity" />
              <IconChip name="else" iconAid="icon_rarity" />
              {/* <Chip value={"five star"}>{t("five star")}</Chip> */}
              {/* <Chip value={"else"}>{t("else")}</Chip> */}
            </Chip.Group>
          </div>
          <div>
            <Divider my="md" label={t("Type")} />
            <Chip.Group value={state.typeChips} onChange={v => { dispatch({ typeChips: v, type: "type" }) }} multiple>
              <IconChip name="scorer" iconAid="icon_scorer_thumbnail" />
              <IconChip name="buffer" iconAid="icon_buffer_thumbnail" />
              <IconChip name="supporter" iconAid="icon_supporter_thumbnail" />
            </Chip.Group>
          </div>
          <div>
            <Divider my="md" label={t("Attribute")} />
            <Chip.Group value={state.attrChips} onChange={v => { dispatch({ attrChips: v, type: "attr" }) }} multiple>
              <IconChip name="dance" iconAid="icon_parameter_dance" className="" />
              <IconChip name="vocal" iconAid="icon_parameter_vocal" />
              <IconChip name="visual" iconAid="icon_parameter_visual" />
            </Chip.Group>
          </div>
        </div>
        <div className="grow">
          <div className="flex flex-row p-2 justify-evenly align-middle bg-sky-900 rounded-md">
            {party.map((card, index) => {
              return (
                <CharaIconDropZone
                  key={card.id}
                  index={index}
                  onCharaDrop={() => { }}
                  className="flex flex-col items-center justify-start border-y-0 w-full"
                >
                  <DraggableCharaIcon
                    cid={card.id}
                    aid={card.assetId}
                    role={card.type}
                    index={index}
                    attribute={getCardAttribute(card)}
                    onCharaClick={() => { }}
                  />
                </CharaIconDropZone>
              )
            })}
          </div>
          <div className="mt-4 grid gap-2
          grid-cols-[repeat(4,_minmax(min-content,_1fr))]
          md:grid-cols-[repeat(5,_minmax(min-content,_1fr))]
          lg:grid-cols-[repeat(8,_minmax(min-content,_1fr))]
          xl:grid-cols-[repeat(12,_minmax(min-content,_1fr))]">
            {allCards
              .filter(card => cardFilter(card, state))
              .map((card, index) => (
                <div key={card.id} className="">
                  <DraggableCharaIcon
                    cid={card.id}
                    aid={card.assetId}
                    role={card.type}
                    index={index}
                    attribute={getCardAttribute(card)}
                    onCharaClick={() => { }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}
