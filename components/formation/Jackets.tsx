import { getAllPlayableMusic } from "hoshimi-venus/out/db/repository/quest_repository"
import { Dispatch, SetStateAction, useState } from "react"
import { JacketIcon } from "../media/JacketIcon"
import { Music } from "hoshimi-venus/out/types/proto/proto_master"
import { getRawMusic } from "hoshimi-venus/out/db/dao/quest_dao"

export function Jackets({
  setMusic,
  setOpened,
}: {
  setMusic: (_: Music | undefined) => void,
  setOpened: Dispatch<SetStateAction<boolean>>,
}) {
  const musics = getAllPlayableMusic()
  const clickOne = (id: string) => {
    setMusic(getRawMusic(id))
    setOpened(false)
  }
  return (
    <div className="grid grid-cols-8 gap-2">
      {
        Object.values(musics).map(music => {
          return (
            <JacketIcon
              id={music.id}
              assetId={music.assetId}
              name={music.name}
              singer={music.singer}
              onClick={clickOne}
              tooltip
              className="aspect-auto h-24 w-24"
              key={music.id}
            />
          )
        })
      }
    </div>
  )
}
