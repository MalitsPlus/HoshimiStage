import { Chip, Dialog, Modal, Pagination, TextInput, UnstyledButton } from "@mantine/core";
import classNames from "classnames";
import { getCustmap, getMusicPatternIds } from "hoshimi-venus/out/db/repository/quest_repository";
import { MusicChartType } from "hoshimi-venus/out/types/proto/proto_enum";
import { Music } from "hoshimi-venus/out/types/proto/proto_master";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { TFormationM, listFormations } from "../../src/atlas/query";
import CustDragLayer from "../media/CustDragLayer";
import { JacketIcon } from "../media/JacketIcon";
import MyButton from "../misc/MyButton";
import { Jackets } from "./Jackets";
import { NewTeam } from "./NewTeam";
import { Team } from "./Team";
import { IconCircleCheck } from "@tabler/icons";

type LaneInfo = {
  type: "SP" | "Active",
  activeCount: number,
  spSequence?: number,
}

const gamePos2Idx: Record<number, number> = {
  1: 2,
  2: 1,
  3: 3,
  4: 0,
  5: 4
}

export function Formations() {
  console.debug("Formations rendered")
  const [newTeamOpened, setNewTeamOpened] = useState(false)
  const [patterns, setPatterns] = useState<string[]>([])
  const [selectedMusic, setSelectedMusic] = useState<Music>()
  const [selectedPattern, setSelectedPattern] = useState<string>()
  const [jacketOpened, setJacketOpened] = useState(false)
  const [laneInfos, setLaneInfos] = useState<LaneInfo[]>()
  const [mainAttr, setMainAttr] = useState<string>()
  const [isBattle, setIsBattle] = useState(false)
  const [commiter, setCommiter] = useState<string>("")
  const [activePage, setActivePage] = useState(1)
  const [committing, setCommitting] = useState(false)
  const [displayFormations, setDisplayFormations] = useState<TFormationM[]>()
  const [dialogOpened, setDialogOpened] = useState(false)

  const setPattern = (ptn: string) => {
    setSelectedPattern(ptn)
    const custMap = getCustmap(selectedMusic?.id ?? "", ptn ?? "")
    const lanes: LaneInfo[] = Array.from({ length: 5 }, (_, i) => ({
      type: "Active",
      activeCount: 0,
    }))
    for (const onePtn of custMap.musicChartPatterns) {
      if (onePtn.type === MusicChartType.SpecialSkill) {
        lanes[gamePos2Idx[onePtn.position]].type = "SP"
        lanes[gamePos2Idx[onePtn.position]].spSequence = onePtn.sequence
      } else if (onePtn.type === MusicChartType.ActiveSkill) {
        lanes[gamePos2Idx[onePtn.position]].activeCount += 1
      }
    }
    setLaneInfos(lanes)
  }

  const setMusic = (music: Music | undefined) => {
    setSelectedMusic(music)
    if (music) {
      const ptns = getMusicPatternIds(music?.id)
      setPatterns(ptns)
      setPattern(ptns[0])
    }
  }

  const queryList = async () => {
    const params: Record<string, string> = {}
    if (commiter !== "") params.u = commiter
    if (selectedPattern) params.p = selectedPattern
    if (mainAttr) params.a = mainAttr
    if (isBattle) params.b = "true"; else params.b = "false"
    if (activePage > 1) params.n = activePage.toString()
    setCommitting(true)
    const formations = await listFormations(
      Object.keys(params).length === 0 ? undefined : params)
    setCommitting(false)
    if (formations) {
      setDisplayFormations(formations)
    }
  }

  const postCommit = async () => {
    setDialogOpened(true)
    setTimeout(() => {
      setDialogOpened(false)
    }, 3000);
  }

  useEffect(() => {
    queryList()
  }, [])

  return (
    <>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <Modal
          opened={newTeamOpened}
          onClose={() => setNewTeamOpened(false)}
          title="Edit party"
          size="auto"
        >
          <NewTeam
            setOpened={setNewTeamOpened}
            postCommit={postCommit}
          />
        </Modal>
        <Modal
          opened={jacketOpened}
          onClose={() => { setJacketOpened(false) }}
          title="Edit Music"
          size="auto"
        >
          <Jackets setMusic={setMusic} setOpened={setJacketOpened} />
        </Modal>
        <Dialog opened={dialogOpened} size="lg" radius="md">
          <div className="h-8 pl-4">
            <div className="flex flex-row gap-4"><IconCircleCheck color="#6fa765" />{t("Commited!")}</div>
          </div>
        </Dialog>
        <div className="relative grid grid-cols-[minmax(2rem,1fr)_3.75rem_minmax(1rem,67.5rem)_3.75rem_minmax(2rem,1fr)] mt-8">
          <div className="lg:col-start-3 lg:col-span-1 md:col-start-2 md:col-span-3 col-span-5 grid grid-cols-1 gap-4 justify-center">
            <div className="flex flex-row gap-4">
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
              {laneInfos &&
                <div className="h-max place-self-end grow grid grid-cols-5 grid-rows-1 grid-flow-row gap-0">
                  {laneInfos.map((laneInfo, idx) => (
                    <div
                      className="flex-1 text-center odd:bg-[#47474f] even:bg-[#31323c] first:rounded-l-md last:rounded-r-md"
                      key={idx}
                    >
                      <div className={"text-slate-200 font-medium"}>
                        {laneInfo.type}
                      </div>
                      <div className={`text-slate-200 font-medium odd:bg-[#47474f] even:bg-[#31323c]`}>
                        {laneInfo.spSequence ? `@${laneInfo.spSequence}` : laneInfo.activeCount}
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
            <div>
              <div>{t("Main Attribute")}</div>
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
            </div>
            <div>
              <div>{t("Quest Type")}</div>
              <Chip checked={isBattle} onChange={() => setIsBattle((v) => !v)}>
                {t("Battle")}
              </Chip>
            </div>
            <div>
              <TextInput
                label="Commiter"
                className="w-[15rem]"
                value={commiter}
                onChange={(event) => setCommiter(event.currentTarget.value)}
              />
            </div>
            <div className="flex flex-row justify-between">
              <MyButton
                w={100}
                loading={committing ? true : false}
                onClick={() => { queryList() }}
              >
                {t("Search")}
              </MyButton>
              <UnstyledButton
                className={classNames("bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700",
                  "dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:active:bg-emerald-800 ",
                  "disabled:dark:bg-zinc-600",
                  "rounded-md text-white font-medium text-[0.875rem] w-[100px] text-center",
                  "active:transform-none transition duration-150 p-2",
                )}
                onClick={() => setNewTeamOpened(true)}
              >
                {t("New")}
              </UnstyledButton>

            </div>
            <Pagination
              className="justify-center"
              value={activePage}
              onChange={setActivePage}
              siblings={1}
              boundaries={1}
              total={Math.ceil((displayFormations?.length ?? 0) / 10)}
            />
            {
              displayFormations
                ?.slice((activePage - 1) * 10, activePage * 10)
                .map(it =>
                  <Team formation={it} key={it._id} />
                )
            }
            <Pagination
              className="justify-center"
              value={activePage}
              onChange={setActivePage}
              siblings={1}
              boundaries={1}
              total={Math.ceil((displayFormations?.length ?? 0) / 10)}
            />
          </div>
        </div>
        <CustDragLayer />
      </DndProvider>
    </>
  )
}
