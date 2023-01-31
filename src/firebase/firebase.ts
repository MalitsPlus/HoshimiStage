import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { addDoc, collection, getFirestore, Timestamp } from "firebase/firestore";
import { browserLocalPersistence, initializeAuth, signInAnonymously } from "firebase/auth";
import { Live } from "hoshimi-venus/out/types/concert_types";

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
let analytics: Analytics
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)
const simulationCollection = collection(db, "simulation_v2")

async function addSimulation(obj: any | Live, docName: string) {
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }
  if ("charts" in obj) {
    const live = obj as Live
    const getCard = (pos: number) => {
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
    const data = {
      uid: auth.currentUser?.uid,
      time: Timestamp.now(),
      quest: live.quest.id,
      musicPattern: live.quest.musicChartPatternId,
      p1: getCard(1),
      p2: getCard(2),
      p3: getCard(3),
      p4: getCard(4),
      p5: getCard(5),
    }
    await addDoc(simulationCollection, data)
  } else {
    await addDoc(simulationCollection, obj)
  }
}

// Initialize Authentication
const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: undefined,
})

export {
  analytics,
  db,
  auth,
  addSimulation,
}
