import { Card } from "hoshimi-venus/out/types/proto/proto_master";
import { WapCard } from "hoshimi-venus/out/types/wap/card_waps";
import {
  getAllRawCards,
  getAllWapCards as _getAllWapCards,
  getData
} from "./data_mgr";

export const getAllCards = (): Card[] => {
  return getData(getAllRawCards)
}

export const getAllWapCards = (): WapCard[] => {
  return _getAllWapCards()
}
