import { Alert, Modal, MultiSelect, Select, Space } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons"
import { getDefaultParam } from "hoshimi-venus/out/satomi/card"
import { UserCard } from "hoshimi-venus/out/types/card_types"
import { t } from "i18next"
import update from 'immutability-helper'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from "react"
import { getChara, getData, getDefaultUserCard } from "../../src/utils/data_mgr"
import { getCardAttribute } from "../../src/utils/misc"
import { UserData } from "../../src/utils/user_data"
import CharaIcon from "../media/CharaIcon"
import MyButton from "../misc/MyButton"
import NumberComp from "../misc/NumberComp"
import { StageParty } from "./Stage"

function reducer(
  state: UserCard,
  action: Partial<UserCard> & { rtype: string }
): UserCard {
  switch (action.rtype) {
    case "dance":
      return {
        ...state,
        dance: action.dance!,
      }
  }
  return state
}

const StatusCard = memo(function _StatusCard({
  uiPos,
  userCard,
  setUserCard,
}: {
  uiPos: number,
  userCard: UserCard,
  setUserCard: (userCard: UserCard, uiPos: number) => void,
}) {
  const attribute = getCardAttribute(userCard)
  const chara = getData(getChara, userCard.characterId)

  const createSetFunction = (type: string): (_: number) => void => {
    return (newValue: number) => {
      const newCard = {
        ...userCard,
        [type]: newValue,
      }
      setUserCard(newCard, uiPos)
    }
  }
  const createSetSkillLevelFunction = (
    type: "1" | "2" | "3"
  ): (_: number) => void => {
    return (newLevel: number) => {
      if (newLevel > 0) {
        const wapSkillLevel = userCard[`skill${type}`].wapSkillLevels.find(it => it.level === newLevel)
        const newCard = {
          ...userCard,
          [`skillLevel${type}`]: newLevel,
        }
        if (wapSkillLevel) {
          newCard.skills.find(it => it.index === +type)!.skill = wapSkillLevel
        }
        setUserCard(newCard, uiPos)
      }
    }
  }

  return (
    <>
      <div className="flex flex-col items-center px-2">
        <div className="my-4">
          <MyButton className="w-12 h-6 p-1" onClick={() => { setUserCard(getDefaultUserCard(userCard.id), uiPos) }}>
            <div className="text-xs">{t("Reset")}</div>
          </MyButton>
        </div>
        <div>
          <CharaIcon id={userCard.id} assetId={userCard.assetId} role={userCard.type} attribute={attribute} pointer={false} />
        </div>
        <div className="my-2 text-center">{chara?.name ?? "unselected"}</div>
        <NumberComp label="dance" value={userCard.dance} setValue={createSetFunction("dance")} iconId="icon_parameter_dance" />
        <NumberComp label="vocal" value={userCard.vocal} setValue={createSetFunction("vocal")} iconId="icon_parameter_vocal" />
        <NumberComp label="visual" value={userCard.visual} setValue={createSetFunction("visual")} iconId="icon_parameter_visual" />
        <NumberComp label="stamina" value={userCard.stamina} setValue={createSetFunction("stamina")}
          iconId="icon_parameter_stamina"
          step={1000}
        />
        <NumberComp label="mental" value={userCard.mental} setValue={createSetFunction("mental")}
          iconId="icon_parameter_mental"
          step={1000}
        />
        <NumberComp label="technique" value={userCard.technique} setValue={createSetFunction("technique")}
          iconId="icon_parameter_technique"
          step={1000}
        />
        <NumberComp label="skill 1" value={userCard.skillLevel1} setValue={createSetSkillLevelFunction("1")}
          iconId="icon_parameter_s1"
          min={1} max={6} step={1}
        />
        <NumberComp label="skill 2" value={userCard.skillLevel2} setValue={createSetSkillLevelFunction("2")}
          iconId="icon_parameter_s2"
          min={1} max={6} step={1}
        />
        <NumberComp label="skill 3" value={userCard.skillLevel3} setValue={createSetSkillLevelFunction("3")}
          iconId="icon_parameter_s3"
          min={1} max={6} step={1}
        />
        <Space h={8} />
        <MultiSelect data={[]} placeholder="Add Ex Skills" disabled />
      </div>
    </>
  )
})

const createInitState = (
  party: StageParty,
  userData: UserData,
): (UserCard | undefined)[] => {
  return Object.entries(party).map(([uiPos, partycard]) => {
    return partycard.cardId ? userData.getCard(partycard.cardId) : undefined
  })
}

const regulateParams = (cards: { [id: string]: UserCard }) => {
  Object.values(cards).forEach(it => {
    if (!it.dance) it.dance = getDefaultParam(it, "dance")
    if (!it.vocal) it.vocal = getDefaultParam(it, "vocal")
    if (!it.visual) it.visual = getDefaultParam(it, "visual")
    if (!it.mental) it.mental = 5000
    if (!it.technique) it.technique = 8000
    if (!it.skillLevel1) it.skillLevel1 = 6
    if (!it.skillLevel2) it.skillLevel2 = 5
    if (!it.skillLevel3) it.skillLevel3 = 4
  })
}

const StatusPannel = ({
  initParty,
  userData,
  setUserData,
  opened,
  setOpened,
}: {
  initParty: StageParty,
  userData: UserData,
  setUserData: (val: UserData | ((prevState: UserData) => UserData)) => void,
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>,
}) => {

  const [localCards, setLocalCards] = useState(createInitState(initParty, userData))

  const setUserCard = useCallback((userCard: UserCard, uiPos: number) => {
    setLocalCards(prev => {
      return update(prev, {
        [uiPos]: { $set: userCard }
      })
    })
  }, [])

  useEffect(() => {
    setLocalCards(createInitState(initParty, userData))
    console.debug("running statuspannel effect")
  }, [initParty, userData])

  console.debug("rendering StatusPannel")

  const onClose = () => {
    if (localCards.every(it => it !== undefined)) {
      const newCards = localCards.reduce((acc: { [id: string]: UserCard }, cur) => {
        acc[cur!.id] = cur!
        return acc
      }, {})
      regulateParams(newCards)
      setUserData(prev => {
        return {
          ...prev,
          cards: {
            ...prev.cards,
            ...newCards,
          }
        }
      })
    }
    setOpened(false)
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Adjust status"
      overflow="outside"
      size="auto"
    >
      <div className="grid grid-cols-5 items-center divide-x divide-dashed divide-slate-500/25">
        {localCards.map((it, idx) => {
          return (it
            ? <StatusCard
              key={idx}
              uiPos={idx}
              userCard={it}
              setUserCard={setUserCard}
            />
            : null
          )
        })}
      </div>
      <Space h={16} />
      <Alert icon={<IconAlertCircle size={16} />} title={<div className="text-base">{t("Notice")}</div>} color="indigo">
        <div className="text-base">{t("Adjust pannel hint")}</div>
      </Alert>
      <Space h={16} />
      <div className="[direction:rtl]">
        <MyButton onClick={() => { setOpened(false) }}>
          {t("Cancel Changes")}
        </MyButton>
      </div>
    </Modal>
  )
}

export default memo(StatusPannel)
