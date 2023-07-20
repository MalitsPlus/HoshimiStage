import { Modal } from "@mantine/core"
import { WapQuest } from "hoshimi-venus/out/types/wap/quest_waps"
import { Dispatch, SetStateAction, memo } from "react"

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

  }

  return (
    <Modal
      opened={opened && wapQuest !== undefined}
      onClose={onClose}
    >
      <></>
    </Modal>
  )
}

export default memo(AutoFormationPannel)
