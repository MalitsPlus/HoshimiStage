import { UserCard } from "hoshimi-venus/out/types/card_types"
import { StageParty } from "../../components/live/Stage"
import { getDefaultUserCard } from "./data_mgr"

type UserDeck = {
  id: string,
  name: string,
  party: {
    [index: number]: string,
  }
}

export type UserData = {
  cards: {
    [id: string]: UserCard
  },
  decks: UserDeck[],
  readonly getCard: (this: UserData, id: string) => UserCard,
  readonly getDeck: (this: UserData, id: string) => UserDeck | undefined,
}

export const getDefaultUserData = (): UserData => {
  return {
    cards: {},
    decks: [],
    getCard(this, id) {
      return this.cards[id] ?? getDefaultUserCard(id)
    },
    getDeck(this, id) {
      return this.decks.find(deck => deck.id === id) ?? undefined
    },
  }
}

export const stringifyUserData = (userData: UserData): string => {
  return JSON.stringify(userData)
}

export const parseUserData = (userDataStr: string): UserData => {
  const userData = JSON.parse(userDataStr) as UserData
  return {
    ...userData,
    getCard(this, id) {
      return this.cards[id] ?? getDefaultUserCard(id)
    },
    getDeck(this, id) {
      return this.decks.find(deck => deck.id === id) ?? undefined
    },
  }
}

export const createInitState = (
  party: StageParty,
  userData: UserData,
): (UserCard | undefined)[] => {
  return Object.entries(party).map(([uiPos, partycard]) => {
    return partycard.cardId ? userData.getCard(partycard.cardId) : undefined
  })
}
