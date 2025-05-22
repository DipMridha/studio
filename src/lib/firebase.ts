
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

// For detecting if the user literally used common placeholder strings as values
const commonApiKeyPlaceholderPattern = "YOUR_API_KEY";
const commonAuthDomainPlaceholderPattern = "YOUR_AUTH_DOMAIN";
const commonProjectIdPlaceholderPattern = "YOUR_PROJECT_ID";

let displayedApiKey = String(apiKey); // Ensure apiKey is treated as a string for checks

if (!apiKey || apiKey.trim() === "") {
    displayedApiKey = "MISSING_OR_EMPTY";
} else if (apiKey.includes(commonApiKeyPlaceholderPattern)) {
    // If the key itself contains "YOUR_API_KEY", it's almost certainly a placeholder.
    displayedApiKey = `'${apiKey}' (Common placeholder pattern '${commonApiKeyPlaceholderPattern}' detected)`;
} else if (apiKey.length < 20 && apiKey.length > 0) { // Real API keys are much longer
     displayedApiKey = `'${apiKey}' (Suspiciously short for a Firebase API key)`;
} else if (apiKey.length >= 20) { // Only mask if it looks somewhat like a real key
    displayedApiKey = "********" + apiKey.substring(apiKey.length - 4);
}
// If apiKey was undefined or empty, displayedApiKey would be "MISSING_OR_EMPTY"


// Check if the essential Firebase config values are present and not placeholders
if (!apiKey || apiKey.trim() === "" || apiKey.includes(commonApiKeyPlaceholderPattern)) {
  throw new Error(
    `Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, a placeholder, or invalid. Received: ${displayedApiKey}.\n` +
`Troubleshooting steps:\n` +
`1. Firebase Studio: Ensure your Firebase project is correctly linked and syncing environment variables with their ACTUAL values.\n` +
`2. Local Development: Verify your '.env.local' file in the project root. It MUST contain your actual Firebase project credentials. Example:\n` +
`   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy............" (This must be your real key from Firebase Console)\n` +
`   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"\n` +
`   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"\n` +
`   (and other NEXT_PUBLIC_FIREBASE_... variables. Ensure they are ACTUAL values from your Firebase console and NOT placeholders like "YOUR_PROJECT_ID" or "your-project-id" if that's not your real project ID.)\n` +
`3. IMPORTANT: After creating or editing the '.env.local' file, you MUST restart your Next.js development server for changes to take effect.\n` +
`4. Double-check that the values copied from your Firebase console are exact and have no typos or extra characters (like quotes unless they are part of the key itself, which is rare for API keys).`
  );
}

if (!authDomain || authDomain.includes(commonAuthDomainPlaceholderPattern) || authDomain.trim() === "" || authDomain.toLowerCase().includes("your-project-id") || authDomain.toLowerCase().includes("your_project_id")) {
  throw new Error(`Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) is missing, a placeholder, or invalid. Received: '${authDomain}'. Check your Firebase project configuration and environment variables. It should look like 'your-actual-project-id.firebaseapp.com'.`);
}
if (!projectId || projectId.includes(commonProjectIdPlaceholderPattern) || projectId.trim() === "" || projectId.toLowerCase().includes("your-project-id") || projectId.toLowerCase().includes("your_project_id")) {
  throw new Error(`Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing, a placeholder, or invalid. Received: '${projectId}'. Check your Firebase project configuration and environment variables. It should be your actual Firebase project ID.`);
}


const firebaseConfig = {
  apiKey: apiKey, // Will be the valid key if checks passed
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket || `${projectId}.appspot.com`, // Default structure if not set
  messagingSenderId: messagingSenderId, // Can be undefined if not used
  appId: appId, // Can be undefined if not used
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
