import { Card } from "hoshimi-venus/out/types/proto/proto_master";
import { DATA_ENV } from "../dev_conf";

function gdt<T>(func: <R>() => R): <R>() => R{
  return func()
}

export function getData<T>(func: () => T): T {
  return func()
}

type Fr<T> = () => T
type PromiseReturnType<T> = T extends Fr<infer R> ? R : T

export function getAllCards(): Partial<Card>[] {
  if (DATA_ENV === "pkg") {
    return []
  }
  return []
}

const xx = getData(getAllCards)
