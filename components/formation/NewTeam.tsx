import { Chip, Modal, NumberInput, Space, TextInput, Textarea, UnstyledButton } from "@mantine/core"
import { getCustmap, getMusicPatternIds } from "hoshimi-venus/out/db/repository/quest_repository"
import { AttributeType } from "hoshimi-venus/out/types/proto/proto_enum"
import { Music } from "hoshimi-venus/out/types/proto/proto_master"
import { Custmap } from "hoshimi-venus/out/types/wap/quest_waps"
import { t } from "i18next"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { TFormation, addFormation } from "../../src/atlas/query"
import { getAllCards } from "../../src/utils/data_repository"
import { getCardAttribute } from "../../src/utils/misc"
import Greenroom from "../live/Greenroom"
import NoteFlow from "../live/NoteFlow"
import { StageParty, index2GamePos } from "../live/Stage"
import CharaIcon from "../media/CharaIcon"
import { JacketIcon } from "../media/JacketIcon"
import MyButton from "../misc/MyButton"
import { Jackets } from "./Jackets"
import { getRawMusic } from "hoshimi-venus/out/db/dao/quest_dao"

type Reliability = "Barely" | "Medium" | "Solid"

const ThreeAttrBtn = ({
  onAttrClick,
}: {
  onAttrClick: (attr: AttributeType) => void,
}) => {
  return (
    <div className="flex flex-row justify-center gap-1">
      <UnstyledButton onClick={() => onAttrClick(AttributeType.Dance)}>
        <div className="w-4 h-4 rounded-full bg-dance"></div>
      </UnstyledButton>
      <UnstyledButton onClick={() => onAttrClick(AttributeType.Vocal)}>
        <div className="w-4 h-4 rounded-full bg-vocal"></div>
      </UnstyledButton>
      <UnstyledButton onClick={() => onAttrClick(AttributeType.Visual)}>
        <div className="w-4 h-4 rounded-full bg-visual"></div>
      </UnstyledButton>
    </div>
  )
}

export function NewTeam({
  setOpened,
  postCommit,
  clonedFormation,
}: {
  setOpened: Dispatch<SetStateAction<boolean>>,
  postCommit: () => Promise<void>,
  clonedFormation?: TFormation,
}) {

  const [selectedMusic, setSelectedMusic] = useState<Music>()
  const [patterns, setPatterns] = useState<string[]>([])
  const [selectedPattern, setSelectedPattern] = useState<string>()
  const [custmap, setCustmap] = useState<Custmap>()

  const [stageParty, setStageParty] = useState<StageParty>({
    0: { cardId: undefined, ingamePos: 4 },
    1: { cardId: undefined, ingamePos: 2 },
    2: { cardId: undefined, ingamePos: 1 },
    3: { cardId: undefined, ingamePos: 3 },
    4: { cardId: undefined, ingamePos: 5 },
  })

  const [isBattle, setIsBattle] = useState(false)
  const [mustPhoto, setMustPhoto] = useState(false)
  const [reliability, setReliability] = useState<Reliability>("Medium")
  const [comments, setComments] = useState<string[]>(["", "", "", "", ""])
  const [mainScorer, setMainScorer] = useState<boolean[]>([false, false, false, false, false])
  const [mainAttr, setMainAttr] = useState<string>()
  const [estimatedScore, setEstimatedScore] = useState<number | "">("")
  const [committer, setCommitter] = useState<string>()
  const [comment, setComment] = useState<string>()

  const [jacketOpened, setJacketOpened] = useState(false)
  const [greenroomOpened, setGreenroomOpened] = useState(false)
  const [committing, setCommitting] = useState(false)

  const queryAdd = async () => {
    if (!selectedMusic
      || !selectedPattern
      || !custmap
      || !mainAttr
      || !comments.every(it => it.length <= 50)
      || (committer && committer?.length > 18)
      || (estimatedScore !== "" && estimatedScore >= 100)
    ) {
      return
    }
    const formation: TFormation = {
      user: committer ?? "<anonymous>",
      musicId: selectedMusic.id,
      chartPatternId: selectedPattern,
      mainAttr: mainAttr as "Dance" | "Vocal" | "Visual" | "Unknown",
      isBattle: isBattle,
      needPhotos: mustPhoto,
      reliability: reliability,
      indexes: Object.entries(stageParty).map(([k, v]) => {
        const idx = +k
        return {
          index: idx,
          inGamePosition: v.ingamePos,
          attribute: AttributeType[custmap[`position${idx + 1}AttributeType` as keyof Custmap] as AttributeType] as "Dance" | "Vocal" | "Visual" | "Unknown",
          cardId: v.cardId,
          comment: comments[idx],
          isMainScorer: mainScorer[idx],
        }
      }),
      time: Date.now(),
    }

    if (estimatedScore !== "") {
      formation.estimatedScore = estimatedScore
    }

    setCommitting(true)
    const succeed = await addFormation(formation)
    setCommitting(false)
    if (succeed) {
      setOpened(false)
      postCommit()
    }
  }

  const setAttribute = (position: number, attr: AttributeType) => {
    setCustmap(prev => {
      if (!prev) return undefined
      return {
        ...prev,
        [`position${position}AttributeType`]: attr,
      }
    })
  }

  const setPattern = (ptn: string) => {
    setSelectedPattern(ptn)
    const custMap = getCustmap(selectedMusic?.id ?? "", ptn ?? "")
    setCustmap(custMap)
  }

  const setMusic = (music: Music | undefined) => {
    setSelectedMusic(music)
    if (music) {
      const ptns = getMusicPatternIds(music?.id)
      setPatterns(ptns)
      setPattern(ptns[0])
    }
  }

  useEffect(() => {
    if (clonedFormation) {
      setMusic(getRawMusic(clonedFormation.musicId))
      setPattern(clonedFormation.chartPatternId)
      setStageParty({
        0: { cardId: clonedFormation.indexes[0].cardId, ingamePos: 4 },
        1: { cardId: clonedFormation.indexes[1].cardId, ingamePos: 2 },
        2: { cardId: clonedFormation.indexes[2].cardId, ingamePos: 1 },
        3: { cardId: clonedFormation.indexes[3].cardId, ingamePos: 3 },
        4: { cardId: clonedFormation.indexes[4].cardId, ingamePos: 5 },
      })
      setMainScorer(clonedFormation.indexes.map(it => it.isMainScorer))
      setComments(clonedFormation.indexes.map(it => it.comment))
      clonedFormation.indexes.forEach(idx => {
        setAttribute(idx.index + 1, AttributeType[idx.attribute])
      })
      setMainAttr(clonedFormation.mainAttr)
      setIsBattle(clonedFormation.isBattle)
      setMustPhoto(clonedFormation.needPhotos)
      setReliability(clonedFormation.reliability)
      setCommitter(clonedFormation.user)
    }
  }, [])

  return (
    <>
      <Modal
        opened={jacketOpened}
        onClose={() => { setJacketOpened(false) }}
        title="Edit party"
        size="auto"
      >
        <Jackets setMusic={setMusic} setOpened={setJacketOpened} />
      </Modal>
      <Modal
        opened={greenroomOpened}
        onClose={() => { setGreenroomOpened(false) }}
        title="Edit party"
      >
        <Greenroom
          initParty={stageParty}
          onSetParty={setStageParty}
          opened={greenroomOpened}
          setOpened={setGreenroomOpened}
        />
      </Modal>
      <div className="grid grid-cols-[max-content,_1fr] gap-4">
        <div>
          <div className="grid gap-4 grid-cols-[100px_minmax(128px,_1fr)]">
            <JacketIcon
              className="aspect-auto w-24 h-24 rounded-lg overflow-hidden"
              id={selectedMusic?.id ?? ""}
              assetId={selectedMusic?.assetId ?? ""}
              name={selectedMusic?.name}
              tooltip={selectedMusic ? true : false}
              onClick={() => { setJacketOpened(true) }}
            />
            <div className="grid gap-2 grid-rows-3">
              <div>{selectedMusic?.name}</div>
              <Chip.Group
                value={selectedPattern}
                onChange={(val: string) => { setPattern(val) }}
              >
                {patterns.map(ptn =>
                  <Chip value={ptn} key={ptn} size="sm">
                    {ptn}
                  </Chip>
                )}
              </Chip.Group>
            </div>
          </div>
          <Space h={16} />
          <div className="grid grid-cols-5 gap-2">
            {
              Object.entries(stageParty).map(([k, ptcard]) => {
                const idx = +k
                const card = getAllCards().find(it => it.id === ptcard.cardId)
                return (
                  <div className="flex flex-col items-center gap-2" key={card?.id ?? k}>
                    <CharaIcon
                      pointer={true}
                      id={card?.id}
                      assetId={card?.assetId}
                      role={card?.type}
                      attribute={card ? getCardAttribute(card) : undefined}
                      onCharaClick={() => setGreenroomOpened(true)}
                    />
                    <Textarea
                      value={comments[idx]}
                      error={comments[idx].length > 50 ? t("Too many characters") : null}
                      onChange={(event) => {
                        setComments(prev => {
                          const cur = prev.slice()
                          cur[idx] = event.target.value
                          return cur
                        })
                      }}
                    />
                    <Chip
                      checked={mainScorer[idx]}
                      onChange={() =>
                        setMainScorer(prev => {
                          const cur = prev.slice()
                          cur[idx] = !cur[idx]
                          return cur
                        })
                      }
                    >
                      {t("Main Scorer")}
                    </Chip>
                  </div>
                )
              })
            }
          </div>
          <Space h={16} />
          <div><span className="text-red-500">*</span>{t("Main Attribute")}</div>
          <Space h={4} />
          <div className="flex flex-row gap-2">
            <Chip.Group
              value={mainAttr}
              onChange={(val: string) => { setMainAttr(val) }}
            >
              <Chip value="Dance" color="blue">{t("Dance")}</Chip>
              <Chip value="Vocal" color="pink">{t("Vocal")}</Chip>
              <Chip value="Visual" color="orange">{t("Visual")}</Chip>
            </Chip.Group>
          </div>
          <Space h={16} />
          <div>{t("Flags")}</div>
          <Space h={4} />
          <div className="flex flex-row gap-2">
            <Chip checked={isBattle} onChange={() => setIsBattle((v) => !v)}>
              {t("Is Battle")}
            </Chip>
            <Chip checked={mustPhoto} onChange={() => setMustPhoto((v) => !v)}>
              {t("Need Photos")}
            </Chip>
          </div>
          <Space h={16} />
          <div>{t("Reliability")}</div>
          <Space h={4} />
          <div className="flex flex-row gap-2">
            <Chip.Group
              value={reliability}
              onChange={(val: Reliability) => { setReliability(val) }}
            >
              <Chip value="Barely" color="pink">{t("Barely")}</Chip>
              <Chip value="Medium" color="orange">{t("Medium")}</Chip>
              <Chip value="Solid" color="teal">{t("Solid")}</Chip>
            </Chip.Group>
          </div>
          <Space h={16} />
          <div>
            <NumberInput
              label={t("Estimated Score (G)")}
              w={200}
              hideControls
              value={estimatedScore}
              placeholder={t("0~99.9G").toString()}
              precision={1}
              onChange={setEstimatedScore}
              error={+estimatedScore < 100 ? false : true}
            />
          </div>
          <Space h={16} />
          <div>
            <TextInput
              label={t("Committer")}
              w={200}
              placeholder="<anonymous>"
              value={committer}
              onChange={(event) => setCommitter(event.currentTarget.value)}
              error={committer && committer?.length > 18 ? true : false}
            />
          </div>
          <Space h={16} />
          <div className="flex justify-end">
            <MyButton
              onClick={queryAdd}
              loading={committing ? true : false}>
              {t("Commit")}
            </MyButton>
          </div>
        </div>
        <div>
          {custmap && (
            <>
              <div className="grid grid-cols-2">
                <div className="flex flex-row justify-start gap-2">
                  <span>{t("Tint all")}</span>
                  <ThreeAttrBtn onAttrClick={(attr: AttributeType) => {
                    setAttribute(1, attr)
                    setAttribute(2, attr)
                    setAttribute(3, attr)
                    setAttribute(4, attr)
                    setAttribute(5, attr)
                    setMainAttr(AttributeType[attr])
                  }}
                  />
                </div>
              </div>
              <Space h={16} />
              <div className="grid grid-cols-5 gap-2">
                {custmap && [0, 1, 2, 3, 4].map(index => {
                  const ingameIndex = index2GamePos[index]
                  const att = custmap[`position${index + 1}AttributeType` as keyof Custmap] as AttributeType
                  return (
                    <div key={index} className="">
                      <ThreeAttrBtn onAttrClick={(attr: AttributeType) => setAttribute(index + 1, attr)} />
                      <Space h={16} />
                      <NoteFlow
                        attribute={att}
                        ingameIndex={ingameIndex}
                        custMap={custmap}
                      />
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
