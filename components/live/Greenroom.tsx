import { Chip, Divider } from "@mantine/core"
import { Card } from "hoshimi-venus/out/types/proto/proto_master"
import { t } from "i18next"
import { ReactNode, useMemo, useState } from "react"
import { getAllCards, getData } from "../../src/utils/datamgr"
import ImageAsset from "../misc/ImageAsset"
import MyButton from "../misc/MyButton"

export default function Greenroom({
  party,
  setParty,
}: {
  party: Card[],
  setParty: (pt: Card[]) => void,
}) {
  const [starChips, setStarChips] = useState<string[]>(["five star"])
  const [typeChips, setTypeChips] = useState<string[]>([])
  const [attrChips, setAttrChips] = useState<string[]>([])
  const allCards = useMemo(() => {
    return getData(getAllCards)
  }, [])

  const onChipsChange = (v: string[], type: "star" | "type" | "attr" | "all") => {
    switch (type) {
      case "star": setStarChips(v); break;
      case "type": setTypeChips(v); break;
      case "attr": setAttrChips(v); break;
      case "all":
        setStarChips(v);
        setTypeChips(v);
        setAttrChips(v);
        break;
    }

  }

  const IconChip = ({ name, iconAid }: {
    name: string, iconAid: string
  }) => {
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
      <div>
        <MyButton onClick={() => { onChipsChange([], "all") }}>
          {t("clear")}
        </MyButton>
      </div>
      <div>
        <Divider my="md" label={t("Initial Rarity")} />
        <Chip.Group value={starChips} onChange={v => { onChipsChange(v, "star") }} multiple>
          <Chip value={"five star"}>{t("five star")}</Chip>
          <Chip value={"else"}>{t("else")}</Chip>
        </Chip.Group>
      </div>
      <div>
        <Divider my="md" label={t("Type")} />
        <Chip.Group value={typeChips} onChange={v => { onChipsChange(v, "type") }} multiple>
          <IconChip name="scorer" iconAid="icon_scorer_thumbnail" />
          <IconChip name="buffer" iconAid="icon_buffer_thumbnail" />
          <IconChip name="supporter" iconAid="icon_supporter_thumbnail" />
        </Chip.Group>
      </div>
      <div>
        <Divider my="md" label={t("Attribute")} />
        <Chip.Group value={attrChips} onChange={v => { onChipsChange(v, "attr") }} multiple>
          <IconChip name="dance" iconAid="icon_scorer_thumbnail" />
          <IconChip name="vocal" iconAid="icon_buffer_thumbnail" />
          <IconChip name="visual" iconAid="icon_supporter_thumbnail" />
        </Chip.Group>
      </div>
    </>
  )
}