import { Space } from "@mantine/core";
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";
import { t } from "i18next";
import { useState } from "react";
import { getMusicJacket } from "../../src/utils/misc";
import ImageAsset from "../misc/ImageAsset";
import MyButton from "../misc/MyButton";
import QuestSelect from "./QuestSelect";

export default function Kockpit({
  wapQuest,
  setWapQuest,
  onSimulateClick,
  onStatusEditClick,
}: {
  wapQuest: WapQuest | undefined,
  setWapQuest: (wapQuest: WapQuest | undefined) => void,
  onSimulateClick: () => void,
  onStatusEditClick: () => void,
}) {
  const [opened, setOpened] = useState(false)
  return (
    <>
      <QuestSelect
        opened={opened}
        setOpened={setOpened}
        initQuestId={wapQuest?.id}
        setWapQuest={setWapQuest}
      />
      <div className="flex flex-row items-center overflow-visible h-20 p-4">
        <div className="flex flex-row items-center overflow-visible grow">
          <div className="flex flex-row justify-start items-center cursor-pointer overflow-visible"
            onClick={() => setOpened(true)}
          >
            <div className="w-14 h-14">
              {wapQuest
                ? <ImageAsset aid={getMusicJacket(wapQuest.musicId)} aspect="1" />
                : <ImageAsset aid="chara_icon_placeholder" aspect="1" env="local" className="rounded-md w-14 h-14" />
              }
            </div>
            {wapQuest ?
              <div className="pl-4 text-start lg:text-2xl md:text-xl">
                {wapQuest.musicName}
              </div>
              : null
            }
          </div>
        </div>
        <div>
          <MyButton disabled className="w-24 h-10" onClick={() => { }}>{t("PvP Mode")}</MyButton>
        </div>
        <Space w={16} />
        <div>
          <MyButton className="w-24 h-10" onClick={onStatusEditClick}>{t("edit status")}</MyButton>
        </div>
        <Space w={16} />
        <div>
          <MyButton className="w-24 h-10" onClick={onSimulateClick}>{t("simulate")}</MyButton>
        </div>
      </div>
    </>
  )
}
