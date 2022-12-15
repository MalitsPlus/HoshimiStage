import update from "immutability-helper"
import { Chip, Divider } from "@mantine/core"
import { AttributeType, CardType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { t } from "i18next"
import { ImageProps } from "next/image"
import { memo, SetStateAction, useCallback, useMemo, useReducer } from "react"
import { getAllCards, getData, getRawCard } from "../../src/utils/datamgr"
import { getCardAttribute, isCardInParty, isIdInParty } from "../../src/utils/misc"
import CharaIconDropZone from "../media/CharaIconDropZone"
import DraggableCharaIcon from "../media/DraggableCharaIcon"
import ImageAsset from "../misc/ImageAsset"
import MyButton from "../misc/MyButton"
import { TParty } from "./Stage"

type TState = {
  starChips: string[],
  typeChips: string[],
  attrChips: string[],
}

function reducer(state: TState, action: Partial<TState & { type: string }>): TState {
  switch (action.type) {
    case "star":
      return {
        ...state,
        starChips: action.starChips!,
      }
    case "type":
      return {
        ...state,
        typeChips: action.typeChips!,
      }
    case "attr":
      return {
        ...state,
        attrChips: action.attrChips!,
      }
    case "all":
      return {
        ...state,
        starChips: action.starChips!,
        typeChips: action.typeChips!,
        attrChips: action.attrChips!,
      }
  }
  return state
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
  focusPosition,
  setFocusPosition,
  onCharaDrop,
}: {
  party: TParty,
  setParty: (pt: SetStateAction<TParty>) => void,
  focusPosition: number | undefined,
  setFocusPosition: (p: number) => void,
  onCharaDrop: (srcId: string, srcIndex: number, dest: number) => void,
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

  const onPartyCharaClick = (index: number, id?: string) => {
    setFocusPosition(index)
  }

  const onGreenCharaClick = useCallback((id: string, index: number) => {
    if (focusPosition === undefined) {
      return
    }
    if (isIdInParty(id, party)) {
      console.log(id)
      return
    }
    setParty(previous =>
      update(previous, {
        [focusPosition]: {
          card: { $set: getData(getRawCard, id) }
        }
      })
    )
  }, [focusPosition, party, setParty])

  return (
    <>
      <div className="flex flex-row gap-4">
        <div>
          <div>
            <MyButton onClick={() => { dispatch({ starChips: [], typeChips: [], attrChips: [], type: "all" }) }}>
              {t("reset")}
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
          <div className="flex flex-row p-2 justify-evenly items-center align-middle bg-neutral-300 dark:bg-neutral-800 rounded-lg">
            {Object.entries(party).map(([k, ptcard]) => {
              return (
                <CharaIconDropZone
                  key={k}
                  index={+k}
                  onCharaDrop={onCharaDrop}
                  className={`flex flex-row items-center justify-center aspect-square w-16 rounded-md border-y-0`}
                >
                  <DraggableCharaIcon
                    card={ptcard.card}
                    index={+k}
                    canDrag={ptcard.card ? true : false}
                    className={focusPosition === +k ? "animate-pulse-quick" : ""}
                    onCharaClick={() => onPartyCharaClick(+k, ptcard.card?.id)}
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
                    card={card}
                    index={index}
                    canDrag={!isCardInParty(card, party)}
                    onCharaClick={() => onGreenCharaClick(card.id, index)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}
