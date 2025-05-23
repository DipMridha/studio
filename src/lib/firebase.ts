
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

// Removed strict error throwing for missing API keys as auth is being removed.
// App will still attempt to initialize Firebase if config is present,
// for potential use of other Firebase services (e.g., Firestore, Genkit backends).
// If these services are used, ensure config is valid.

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
let auth: Auth | null = null; // Initialize auth as null

try {
  if (!getApps().length) {
    if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
    } else {
      console.warn("Firebase config is incomplete. Firebase App and Auth will not be initialized. This is expected if not using Firebase services.");
      // app will remain undefined, and auth will be null
    }
  } else {
    app = getApp();
    // Check if auth needs to be initialized for the existing app
    // This check prevents re-initializing auth if it was already set up
    // and also handles cases where the app was initialized but config might be missing now
    if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
        try {
            auth = getAuth(app);
        } catch (e) {
            console.warn("Could not get Auth instance for existing Firebase app, possibly due to incomplete config.", e);
        }
    } else {
        console.warn("Firebase config is incomplete for existing app. Auth may not be available.");
    }
  }
} catch (error) {
    console.error("Error during Firebase initialization:", error);
    // app might be undefined, auth will be null
}

// Export app (might be undefined if config was bad) and auth (might be null)
export { app, auth };
