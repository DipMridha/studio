
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
const placeholderApiKey = "YOUR_API_KEY"; // Common placeholder
const placeholderAuthDomain = "YOUR_AUTH_DOMAIN";
const placeholderProjectId = "YOUR_PROJECT_ID";

let displayedApiKey = apiKey;
if (apiKey && apiKey.includes(placeholderApiKey.substring(0,10))) { // Check if it looks like a placeholder
    displayedApiKey = "YOUR_API_KEY (Placeholder Detected)";
} else if (!apiKey) {
    displayedApiKey = "MISSING";
} else {
    displayedApiKey = "********" + apiKey.substring(apiKey.length - 4); // Show only last 4 chars for some privacy
}


if (!apiKey || apiKey === placeholderApiKey || apiKey.trim() === "") {
  throw new Error(
    `Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, a placeholder, or invalid. Received: '${displayedApiKey}'.
Troubleshooting steps:
1. Firebase Studio: Ensure your Firebase project is correctly linked and syncing environment variables.
2. Local Development: Verify your '.env.local' file in the project root. It MUST contain your actual Firebase project credentials:
   NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_ACTUAL_API_KEY"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_ACTUAL_AUTH_DOMAIN"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_ACTUAL_PROJECT_ID"
   (and other NEXT_PUBLIC_FIREBASE_... variables)
3. IMPORTANT: After creating or editing the '.env.local' file, you MUST restart your Next.js development server for changes to take effect.
4. Double-check that the values copied from your Firebase console are exact and have no typos.`
  );
}
if (!authDomain || authDomain === placeholderAuthDomain || authDomain.trim() === "") {
  throw new Error("Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) is missing or invalid. Check your Firebase project configuration and environment variables (e.g., .env.local and restart server).");
}
if (!projectId || projectId === placeholderProjectId || projectId.trim() === "") {
  throw new Error("Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing or invalid. Check your Firebase project configuration and environment variables (e.g., .env.local and restart server).");
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
