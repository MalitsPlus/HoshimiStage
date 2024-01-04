import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDoc, getFirestore, Timestamp } from "firebase/firestore";
import { browserLocalPersistence, initializeAuth, signInAnonymously } from "firebase/auth";
import { Live } from "hoshimi-venus/out/types/concert_types";
import { MusicChartType } from "hoshimi-venus/out/types/proto/proto_enum";
import { CustomNote } from "hoshimi-venus/out/types/trans_types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics
// let analytics: Analytics
// if (typeof window !== "undefined") {
//   analytics = getAnalytics(app)
// }

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)
const simulationCollection = collection(db, "simulation_v4")

export type FirestoreCard = {
  cardId: string,
  vocal: number,
  dance: number,
  visual: number,
  stamina: number,
  mental: number,
  technique: number,
  s1: number,
  s2: number,
  s3: number,
}
export type FirestoreLive = {
  uid?: string,
  timestamp: Timestamp,
  quest: string,
  musicPattern: string,
  powers: {
    type: MusicChartType;
    sequence: number;
    position: number;
    power: number;
    privilege: number;
    weightedPower?: number;
  }[],
  customNotes?: CustomNote[],
  p1: FirestoreCard,
  p2: FirestoreCard,
  p3: FirestoreCard,
  p4: FirestoreCard,
  p5: FirestoreCard,
}

async function getSimulation(id: string): Promise<FirestoreLive | undefined> {
  const docRef = doc(simulationCollection, id)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    return snapshot.data() as FirestoreLive
  }
  return undefined
}

async function addSimulation(obj: any | Live, docName: string): Promise<string> {
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }
  if ("charts" in obj) {
    const live = obj as Live
    const getCard = (pos: number): FirestoreCard => {
      const deckCard = live.liveDeck.getCard(pos)
      return {
        cardId: deckCard.id,
        vocal: deckCard.deckVocal,
        dance: deckCard.deckDance,
        visual: deckCard.deckVisual,
        stamina: deckCard.deckStamina,
        mental: deckCard.deckMental,
        technique: deckCard.deckTechnique,
        s1: deckCard.skillLevel1,
        s2: deckCard.skillLevel2,
        s3: deckCard.skillLevel3,
      }
    }
    const data: FirestoreLive = {
      uid: auth.currentUser?.uid,
      timestamp: Timestamp.now(),
      quest: live.quest.id,
      musicPattern: live.quest.musicChartPatternId,
      powers: live.powers,
      customNotes: live.customNotes,
      p1: getCard(1),
      p2: getCard(2),
      p3: getCard(3),
      p4: getCard(4),
      p5: getCard(5),
    }
    const docRef = await addDoc(simulationCollection, data)
    return docRef.id
  } else {
    const docRef = await addDoc(simulationCollection, obj)
    return docRef.id
  }
}

// Initialize Authentication
const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: undefined,
})

export {
  db,
  auth,
  addSimulation,
  getSimulation,
}
