
// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
// Add other Firebase services as needed, e.g., getFirestore, getStorage

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

// Check if the essential Firebase config values are present and not placeholders
if (!apiKey || apiKey === "YOUR_API_KEY" || apiKey.trim() === "") {
  throw new Error(
    "Firebase API Key is missing or invalid. " +
    "Please ensure your Firebase project is correctly linked in Firebase Studio and that environment variables (e.g., NEXT_PUBLIC_FIREBASE_API_KEY) are properly set. " +
    "If running locally, verify your .env.local file."
  );
}
if (!authDomain || authDomain === "YOUR_AUTH_DOMAIN" || authDomain.trim() === "") {
  throw new Error("Firebase Auth Domain is missing or invalid. Check your Firebase project configuration and environment variables.");
}
if (!projectId || projectId === "YOUR_PROJECT_ID" || projectId.trim() === "") {
  throw new Error("Firebase Project ID is missing or invalid. Check your Firebase project configuration and environment variables.");
}


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket || "YOUR_STORAGE_BUCKET", // Other vars can have fallbacks if less critical for init
  messagingSenderId: messagingSenderId || "YOUR_MESSAGING_SENDER_ID",
  appId: appId || "YOUR_APP_ID",
  measurementId: measurementId // Optional, can be undefined
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

// You can also export other Firebase services here if needed
// export const db = getFirestore(app);
// export const storage = getStorage(app);

export { app, auth };
