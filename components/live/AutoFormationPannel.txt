import { Chip, Divider, Modal } from "@mantine/core"
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps"
import { ImageProps } from "next/image"
import { Dispatch, SetStateAction, memo, useCallback, useState } from "react"
import ImageAsset from "../misc/ImageAsset"
import MyButton from "../misc/MyButton"
import { t } from "i18next"
import CharaIcon from "../media/CharaIcon"

const AutoFormationPannel = ({
  opened,
  setOpened,
  wapQuest
}: {
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>,
  wapQuest: WapQuest | undefined,
}) => {
  const onClose = () => {
    setOpened(false)
  }

  const [starChips, setStarChips] = useState<string[]>(["fivestar"])
  const [typeChips, setTypeChips] = useState<string[]>()
  const [attrChips, setAttrChips] = useState<string[]>()

  const setChips = useCallback((
    starChips: string[],
    typeChips: string[],
    attrChips: string[],
  ) => {
    setStarChips(starChips)
    setTypeChips(typeChips)
    setAttrChips(attrChips)
  }, [setStarChips, setTypeChips, setAttrChips])

  const IconChip = ({ name, iconAid }: {
    name: string, iconAid: string
  } & Partial<ImageProps>) => {
    return (
      <Chip value={name}>
        <div className="relative aspect-square w-4 mr-0.5 inline-block align-[-3px]">
          <ImageAsset aid={iconAid} aspect="1" env="local" />
        </div>
        <span>{t(name)}</span>
      </Chip>
    )
  }

  return (
    <Modal
      opened={opened && wapQuest !== undefined}
      onClose={onClose}
      title="Select Candidates"
      overflow="outside"
      size="auto"
    >
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
            {Object.entries(localParty).map(([k, ptcard]) => {
              const card = AllCards.find(it => it.id === ptcard.cardId)
              return (
                <CharaIcon

                />
              )
            })}
          </div>
          <div className="mt-4 grid gap-2
          grid-cols-[repeat(4,_minmax(min-content,_1fr))]
          md:grid-cols-[repeat(5,_minmax(min-content,_1fr))]
          lg:grid-cols-[repeat(8,_minmax(min-content,_1fr))]
          xl:grid-cols-[repeat(12,_minmax(min-content,_1fr))]">
            {AllCards
              .filter(card => cardFilter(card, starChips, typeChips, attrChips))
              .map((card, index) => {
                const canDrag = !isCardInParty(card, localParty)
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

    </Modal>
  )
}

export default memo(AutoFormationPannel)
