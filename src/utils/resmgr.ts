import { ENV } from "../dev_conf"

const Paths = {
  music: (id: string) => ({
    local: `/img/${id}.png`,
    remote: `${id}`
  }),
}

export const MusicPath = (id: string) => Paths.music(id)[ENV]
