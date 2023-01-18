import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps";
import ImageAsset from "../misc/ImageAsset";
import MyButton from "../misc/MyButton";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { Button, Modal, Space } from "@mantine/core";
import QuestSelect from "./QuestSelect";
import { getMusicJacket } from "../../src/utils/misc";
import { useClickOutside } from "@mantine/hooks";
import { IconQuestionMark } from "@tabler/icons";

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
          <div className="cursor-pointer overflow-visible"
            onClick={() => setOpened(true)}
          >
            <div className="inline-block align-middle w-14 h-14">
              {wapQuest
                ? <ImageAsset aid={getMusicJacket(wapQuest.musicId)} aspect="1" />
                : <ImageAsset
                  aid="chara_icon_placeholder"
                  aspect="1"
                  env="local"
                  className="rounded-md w-14 h-14"
                />}
            </div>
            <div className="inline-block pl-4 text-3xl text-start align-middle">
              {wapQuest?.musicName}
            </div>
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
