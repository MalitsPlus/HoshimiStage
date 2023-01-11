import { RESOURCE_ENV } from "../dev_conf"

const Paths = {
  image: (id: string) => ({
    local: `/img/${id}.png`,
    remote: `${id}`,
  }),
  others: (id: string) => ({
    local: ``,
    remote: ``,
  })
}

export const getAssetUri = (
  _type: "image" | "others",
  id: string
) => Paths[_type](id)[RESOURCE_ENV]
