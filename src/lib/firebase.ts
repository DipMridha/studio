
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

const commonApiKeyPlaceholderPattern = "YOUR_API_KEY"; // A common placeholder pattern
const commonAuthDomainPlaceholderPattern = "YOUR_AUTH_DOMAIN";
const commonProjectIdPlaceholderPattern = "YOUR_PROJECT_ID";


let displayedApiKey = apiKey ? `'${apiKey}'` : "'Not Set (Missing NEXT_PUBLIC_FIREBASE_API_KEY)'";
if (apiKey && apiKey.includes(commonApiKeyPlaceholderPattern)) {
  displayedApiKey = `'${apiKey}' (Common placeholder pattern '${commonApiKeyPlaceholderPattern}' detected)`;
}

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

if (!authDomain || authDomain.trim() === "" || authDomain.includes(commonAuthDomainPlaceholderPattern) || !authDomain.includes(".firebaseapp.com")) {
    throw new Error(`Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) is missing, a placeholder, or invalid. Received: '${authDomain || 'Not Set'}'. It should be in the format 'your-project-id.firebaseapp.com'.`);
}

if (!projectId || projectId.trim() === "" || projectId.includes(commonProjectIdPlaceholderPattern)) {
    throw new Error(`Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing, a placeholder, or invalid. Received: '${projectId || 'Not Set'}'.`);
}


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
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

export { app, auth };
