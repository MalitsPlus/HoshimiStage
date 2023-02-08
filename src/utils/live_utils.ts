import { StageParty } from "../../components/live/Stage";
import update from 'immutability-helper';

const findCardIndex = (
  srcId: string,
  party: StageParty
) => {
  const srcIdx = +(Object.entries(party).find(([, v]) => v.cardId === srcId)?.at(0) ?? -1)
  console.debug(`called find card ${srcId}`)
  return srcIdx
}

export const charaDropAction = (
  srcId: string,
  dest: number,
  party: StageParty
): StageParty | undefined => {
  const src = findCardIndex(srcId, party)
  if (src !== -1) {
    if (src === dest) {
      console.debug(`same. src: ${src}, dest: ${dest}.`)
      return undefined
    }
    console.debug(`different. src: ${src}, dest: ${dest}.`)
    // Update based on previous states.
    // See https://reactjs.org/docs/hooks-reference.html#functional-updates
    return update(party, {
      [dest]: {
        cardId: { $set: party[src].cardId }
      },
      [src]: {
        cardId: { $set: party[dest].cardId }
      },
    })
  } else {
    return update(party, {
      [dest]: {
        cardId: { $set: srcId }
      }
    })
  }
}
