import { RESOURCE_ENV } from "../dev_conf"

const Paths = {
  image: (id: string) => ({
    local: `/img/${id}.webp`,
    remote: `https://idoly-assets-curator.vercel.app/api/img/${id}`,
  }),
  others: (id: string) => ({
    local: ``,
    remote: ``,
  })
}

export const getAssetUri = (
  _type: "image" | "others",
  id: string,
  env?: "local" | "remote"
) => {
  let useEnv = env ?? RESOURCE_ENV
  if (RESOURCE_ENV === "local") {
    useEnv = RESOURCE_ENV
  }
  return Paths[_type](id)[useEnv]
}
