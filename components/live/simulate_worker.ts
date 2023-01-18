import simulate from "hoshimi-venus"
import { Live } from "hoshimi-venus/out/types/concert_types"
import { CustomNote, TransDeck } from "hoshimi-venus/out/types/trans_types"

export type SimulateWorkerProps = {
  questId: string,
  transDeck: TransDeck,
  transOpntDeck?: TransDeck,
  customNotes?: CustomNote[]
}

const doSimulate = (
  questId: string,
  transDeck: TransDeck,
  transOpntDeck?: TransDeck,
  customNotes?: CustomNote[]
): Live | string => {
  const result = simulate(questId, transDeck, transOpntDeck, customNotes)
  return result
}

self.onmessage = (e: MessageEvent<SimulateWorkerProps>) => {
  const { questId, transDeck, transOpntDeck, customNotes } = e.data
  const result = doSimulate(questId, transDeck, transOpntDeck, customNotes)
  self.postMessage(result)
}
