import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";
import ImageAsset from "../misc/ImageAsset";
import MyButton from "../misc/MyButton";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { Modal } from "@mantine/core";
import QuestSelect from "./QuestSelect";

export default function Kockpit({
  onChartClick
}: {
  onChartClick: () => void
}) {
  const [opened, setOpened] = useState(false)
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("select a quest")}
        overlayOpacity={0.5}
        overlayBlur={2}
        size="lg"
      >
        <QuestSelect />
      </Modal>
      <div className="flex flex-row items-center overflow-visible h-20 p-4">
        <div className="flex flex-row items-center overflow-visible grow">
          <div className="cursor-pointer overflow-visible"
            onClick={() => setOpened(true)}
          >
            <div className="inline-block align-middle w-14 h-14">
              <ImageAsset aid="img_card_thumb_1_kkr-04-casl-00" aspect="1" />
            </div>
            <div className="inline-block pl-4 text-3xl text-start align-middle">
              {t("testt")}
            </div>
          </div>
        </div>
        <div>
          <MyButton className="w-24 h-10">{t("simulate")}</MyButton>
        </div>
      </div>
    </>
  )
}
