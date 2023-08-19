import { getAllRawCards, getAllWapCards, getData } from "./data_mgr";

export const AllCards = getData(getAllRawCards)
export const AllWapCards = getAllWapCards()
