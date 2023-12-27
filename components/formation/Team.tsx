import { Badge, UnstyledButton } from "@mantine/core"
import { getRawMusic } from "hoshimi-venus/out/db/dao/quest_dao"
import { t } from "i18next"
import { TFormation } from "../../src/atlas/query"
import { getAllCards } from "../../src/utils/data_repository"
import { getCardAttribute } from "../../src/utils/misc"
import CharaIcon from "../media/CharaIcon"
import { JacketIcon } from "../media/JacketIcon"
import classNames from "classnames"

export function Team({
  formation,
  cloneTeam,
}: {
  formation: TFormation,
  cloneTeam: (formation: TFormation) => void,
}) {
  const music = getRawMusic(formation.musicId)

  return (
    <div className={`border-solid border-2 rounded-2xl px-2 py-1 w-full
      grid grid-cols-1 gap-2
      ${formation.mainAttr === "Dance"
        ? "border-dance-trans"
        : formation.mainAttr === "Vocal"
          ? "border-vocal-trans"
          : formation.mainAttr === "Visual"
            ? "border-visual-trans"
            : "border-transparent"} `}
    >
      <div className="flex flex-row justify-between">
        <div>
          <Badge mr={4} variant="filled" className="normal-case">
            {formation.user}
          </Badge>
          <UnstyledButton
            className={classNames("bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700",
              "dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:active:bg-emerald-800 ",
              "disabled:dark:bg-zinc-600",
              "rounded-md text-white font-medium text-[0.875rem] w-[100px] text-center",
              "active:transform-none transition duration-150 p-2",
            )}
            onClick={() => cloneTeam(formation)}
          >
            {t("Clone")}
          </UnstyledButton>
        </div>
        <div>
          {new Date(formation.time).toLocaleString(undefined, {
            dateStyle: "medium", timeStyle: "long", hourCycle: "h24"
          })}
        </div>
      </div>
      <div className="flex flex-row gap-2 w-full">
        {music &&
          <JacketIcon
            id={music.id}
            assetId={music.assetId}
            name={music.name}
            singer={music.singer}
            className="aspect-auto h-24 w-24 rounded-lg overflow-hidden shrink-0"
            key={music.id}
          />
        }
        <div className="grid grid-cols-1 grid-flow-row w-full">
          <div className="flex flex-row justify-between">
            <div>{music?.name}</div>
            <div>{formation.estimatedScore ? `${formation.estimatedScore} G` : null}</div>
          </div>

          <div>
            {formation.chartPatternId}
          </div>
          <div className="flex flex-row">
            <Badge mr={4} variant="filled" className="normal-case"
              color={formation.reliability === "Medium"
                ? "orange"
                : formation.reliability === "Solid"
                  ? "teal" : "pink"}
            >
              {t(formation.reliability)}
            </Badge>
            {formation.isBattle
              ? <Badge mr={4} variant="filled" color="grape" className="normal-case">{t("Battle")}</Badge>
              : null
            }
            {
              formation.needPhotos &&
              <Badge mr={4} variant="filled" className="normal-case"
                color="red"
              >
                {t("Photo")}
              </Badge>
            }
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 grid-flow-row justify-between divide-x">
        {
          formation.indexes.map((idx, i) => {
            const card = idx.cardId ? getAllCards().find(it => it.id === idx.cardId) : undefined
            return (
              <div
                key={idx.index}
                className="flex flex-col gap-2 items-center border-[#47474f66]"
              >
                <div
                  className={`text-center text-black font-medium h-max w-full
                  ${i === 0 ? "rounded-l-md" : ""}
                  ${i === 4 ? "rounded-r-md" : ""}
                  ${idx.attribute === "Dance" ? "bg-dance" : idx.attribute === "Vocal" ? "bg-vocal" : idx.attribute === "Visual" ? "bg-visual" : "bg-[#737379]"}`}
                >
                  {idx.attribute}
                </div>
                <div className="h-6">
                  {
                    idx.isMainScorer
                      ? <Badge mr={4}
                        variant="filled"
                        className="normal-case text-center"
                      >
                        {t("Main")}
                      </Badge>
                      : null
                  }
                </div>
                <CharaIcon
                  pointer={false}
                  id={card?.id}
                  assetId={card?.assetId}
                  role={card?.type}
                  attribute={card ? getCardAttribute(card) : undefined}
                />
                <div className="w-full break-words whitespace-pre-wrap text-center">
                  {idx.comment}
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="w-full break-words whitespace-pre-wrap">
        {formation.comment}
      </div>
    </div>
  )
}
