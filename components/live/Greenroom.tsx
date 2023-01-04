import { Chip, Divider } from "@mantine/core"
import { useSessionStorage } from "@mantine/hooks"
import { AttributeType, CardType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { t } from "i18next"
import { ImageProps } from "next/image"
import { useCallback, useMemo } from "react"
import { getAllCards, getData } from "../../src/utils/datamgr"
import { getCardAttribute, isCardInParty } from "../../src/utils/misc"
import CharaIconDropZone from "../media/CharaIconDropZone"
import DraggableCharaIcon from "../media/DraggableCharaIcon"
import ImageAsset from "../misc/ImageAsset"
import MyButton from "../misc/MyButton"
import { AllyParty } from "./Stage"

function cardFilter(card: Card, starChips: string[], typeChips: string[], attrChips: string[]): boolean {
  const rarity = !!!starChips.length
    || card.initialRarity === 5 && starChips.includes("fivestar")
    || card.initialRarity !== 5 && starChips.includes("else")
  const type = !!!typeChips.length
    || card.type === CardType.Appeal && typeChips.includes("scorer")
    || card.type === CardType.Technique && typeChips.includes("buffer")
    || card.type === CardType.Support && typeChips.includes("supporter")
  const attr = !!!attrChips.length
    || getCardAttribute(card) === AttributeType.Dance && attrChips.includes("dance")
    || getCardAttribute(card) === AttributeType.Vocal && attrChips.includes("vocal")
    || getCardAttribute(card) === AttributeType.Visual && attrChips.includes("visual")
  return rarity && type && attr
}

export default function Greenroom({
  party,
  onCharaDrop,
}: {
  party: AllyParty,
  onCharaDrop: (srcId: string, dest: number) => void,
}) {
  const [starChips, setStarChips] = useSessionStorage<string[]>({ key: "Greenroom_starChips", defaultValue: ["fivestar"] })
  const [typeChips, setTypeChips] = useSessionStorage<string[]>({ key: "Greenroom_typeChips", defaultValue: [] })
  const [attrChips, setAttrChips] = useSessionStorage<string[]>({ key: "Greenroom_attrChips", defaultValue: [] })
  // const [focusPosition, setFocusPosition] = useState(clickedCard)

  const setChips = useCallback((
    starChips: string[],
    typeChips: string[],
    attrChips: string[],
  ) => {
    setStarChips(starChips)
    setTypeChips(typeChips)
    setAttrChips(attrChips)
  }, [setStarChips, setTypeChips, setAttrChips])

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

  // const onPartyCharaClick = useCallback((index: number, id?: string) => {
  //   setFocusPosition(index)
  // }, [])

  // const onGreenCharaClick = useCallback((id: string) => {
  //   if (focusPosition === undefined) {
  //     return
  //   }
  //   if (isIdInParty(id, party)) {
  //     console.log(id)
  //     return
  //   }
  //   onCharaDrop(id, focusPosition)
  // }, [])

  return (
    <>
      <div className="flex flex-row gap-4">
        <div>
          <div>
            <MyButton onClick={() => { setChips([], [], []) }}>
              {t("reset")}
            </MyButton>
          </div>
          <div>
            <Divider my="md" label={t("Initial Rarity")} />
            <Chip.Group value={starChips} onChange={v => { setStarChips(v) }} multiple>
              <IconChip name="fivestar" iconAid="icon_rarity" />
              <IconChip name="else" iconAid="icon_rarity" />
              {/* <Chip value={"five star"}>{t("five star")}</Chip> */}
              {/* <Chip value={"else"}>{t("else")}</Chip> */}
            </Chip.Group>
          </div>
          <div>
            <Divider my="md" label={t("Type")} />
            <Chip.Group value={typeChips} onChange={v => { setTypeChips(v) }} multiple>
              <IconChip name="scorer" iconAid="icon_scorer_thumbnail" />
              <IconChip name="buffer" iconAid="icon_buffer_thumbnail" />
              <IconChip name="supporter" iconAid="icon_supporter_thumbnail" />
            </Chip.Group>
          </div>
          <div>
            <Divider my="md" label={t("Attribute")} />
            <Chip.Group value={attrChips} onChange={v => { setAttrChips(v) }} multiple>
              <IconChip name="dance" iconAid="icon_parameter_dance" className="" />
              <IconChip name="vocal" iconAid="icon_parameter_vocal" />
              <IconChip name="visual" iconAid="icon_parameter_visual" />
            </Chip.Group>
          </div>
        </div>
        <div className="grow">
          <div className="flex flex-row p-2 justify-evenly items-center align-middle bg-neutral-300 dark:bg-neutral-800 rounded-lg">
            {Object.entries(party).map(([k, ptcard]) => {
              const card = allCards.find(it => it.id === ptcard.cardId)
              return (
                <CharaIconDropZone
                  key={k}
                  index={+k}
                  onCharaDrop={onCharaDrop}
                  className={`flex flex-row items-center justify-center aspect-square w-16 rounded-md border-y-0`}
                >
                  <DraggableCharaIcon
                    card={card}
                    index={+k}
                    canDrag={card ? true : false}
                    pointer={true}
                  // className={focusPosition === +k ? "animate-pulse-quick" : ""}
                  // onCharaClick={() => onPartyCharaClick(+k, ptcard.card?.id)}
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
              .filter(card => cardFilter(card, starChips, typeChips, attrChips))
              .map((card, index) => {
                const canDrag = !isCardInParty(card, party)
                return (
                  <div key={card.id} className="">
                    <DraggableCharaIcon
                      card={card}
                      index={index}
                      canDrag={canDrag}
                      pointer={canDrag}
                    // onCharaClick={() => onGreenCharaClick(card.id)}
                    />
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </>
  )
}
