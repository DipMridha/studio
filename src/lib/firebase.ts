
// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Placeholders for Firebase config values
const placeholderApiKey = "YOUR_API_KEY"; // Common placeholder string
const placeholderAuthDomain = "YOUR_AUTH_DOMAIN";
const placeholderProjectId = "YOUR_PROJECT_ID";
const commonApiKeyPlaceholderPattern = "YOUR_API_KEY"; // Used to detect common placeholder strings

// Attempt to read Firebase config from environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

// Since authentication is removed, strict checks for auth-related keys are relaxed.
// However, if other Firebase services (like Genkit for AI) are used,
// their respective keys (e.g., GOOGLE_API_KEY for Genkit) would still need to be set.

const firebaseConfig = {
  apiKey: apiKey || undefined, // Use undefined if not set
  authDomain: authDomain || undefined,
  projectId: projectId || undefined,
  storageBucket: storageBucket || (projectId ? `${projectId}.appspot.com` : undefined),
  messagingSenderId: messagingSenderId || undefined,
  appId: appId || undefined,
  measurementId: measurementId || undefined
};

let app: FirebaseApp | null = null; // Initialize as null
let auth: Auth | null = null; // Initialize as null

try {
  if (!getApps().length) {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) { // Only initialize if core config is somewhat present
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
    } else {
      console.warn("Firebase core configuration (API Key or Project ID) is missing. Firebase SDK not initialized. Some features like Genkit AI might not work if they depend on a GOOGLE_API_KEY.");
    }
  } else {
    app = getApp();
    auth = getAuth(app);
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Prevent app crash if Firebase init fails for any reason when auth is not the primary concern.
}

export { app, auth };
