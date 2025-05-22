
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

// Simplified config - will rely on environment variables being correctly set.
// If they are not, Firebase SDK will throw its own errors if a service requiring them is used.
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket || (projectId ? `${projectId}.appspot.com` : undefined),
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  // Only initialize if essential config is somewhat present to avoid immediate crashes
  // if environment variables are completely missing. Specific services might still fail.
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn("Firebase configuration is missing or incomplete. Firebase services may not work.");
    // Create a dummy app object or handle as appropriate if no config
    // This part might need adjustment based on how critical Firebase is post-auth removal
    app = {} as FirebaseApp; // Placeholder to avoid crashes if 'app' is expected
  }
} else {
  app = getApp();
}

// Get Auth instance, it might not be used if auth features are fully removed
// but other parts of the app might still expect it.
// If Firebase is not initialized properly, getAuth might throw an error.
let auth: Auth;
try {
  auth = getAuth(app);
} catch (e) {
  console.warn("Failed to initialize Firebase Auth. If you're not using authentication, this might be fine. Error:", e);
  auth = {} as Auth; // Placeholder
}


// You can also export other Firebase services here if needed
// export const db = getFirestore(app);
// export const storage = getStorage(app);

export { app, auth };
