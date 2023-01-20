import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";

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
const simulationCollection = collection(db, "simulation")

async function addSimulation(data: any, docName: string) {
  await addDoc(simulationCollection, data)
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
