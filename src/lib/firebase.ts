
// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Placeholder patterns to detect common placeholder strings
const commonApiKeyPlaceholderPattern = "YOUR_API_KEY"; // General placeholder
const commonAuthDomainPlaceholderPattern = "YOUR_AUTH_DOMAIN"; // General placeholder
const commonProjectIdPlaceholderPattern = "YOUR_PROJECT_ID"; // General placeholder

// Attempt to read Firebase config from environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

// Create display-friendly versions of the keys for error messages
let displayedApiKey = apiKey ? `'${apiKey}'` : "'Not Set (Missing NEXT_PUBLIC_FIREBASE_API_KEY)'";
if (apiKey && apiKey.includes(commonApiKeyPlaceholderPattern)) {
  displayedApiKey = `'${apiKey}' (Common placeholder pattern '${commonApiKeyPlaceholderPattern}' detected)`;
}

let displayedAuthDomain = authDomain ? `'${authDomain}'` : "'Not Set (Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)'";
if (authDomain && authDomain.includes(commonAuthDomainPlaceholderPattern)) {
    displayedAuthDomain = `'${authDomain}' (Common placeholder pattern '${commonAuthDomainPlaceholderPattern}' detected)`;
}

let displayedProjectId = projectId ? `'${projectId}'` : "'Not Set (Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID)'";
if (projectId && projectId.includes(commonProjectIdPlaceholderPattern)) {
    displayedProjectId = `'${projectId}' (Common placeholder pattern '${commonProjectIdPlaceholderPattern}' detected)`;
}

const errorBaseMessage =
`Troubleshooting steps:
1. Firebase Studio: Ensure your Firebase project is correctly linked and syncing environment variables with their ACTUAL values.
2. Local Development: Verify your '.env.local' file in the project root. It MUST contain your actual Firebase project credentials. Example:
   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy............" (This must be your real key from Firebase Console)
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   (and other NEXT_PUBLIC_FIREBASE_... variables. Ensure they are ACTUAL values from your Firebase console and NOT placeholders like "YOUR_PROJECT_ID" or "your-project-id" if that's not your real project ID.)
3. IMPORTANT: After creating or editing the '.env.local' file, you MUST restart your Next.js development server for changes to take effect.
4. Double-check that the values copied from your Firebase console are exact and have no typos or extra characters (like quotes unless they are part of the key itself, which is rare for API keys).`;

if (!apiKey || apiKey.trim() === "") {
  throw new Error(
    `Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, a placeholder, or invalid. Received: ${displayedApiKey}.\n` + errorBaseMessage
  );
}

if (!authDomain || authDomain.trim() === "" ) {
    throw new Error(`Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) is missing or invalid. Received: ${displayedAuthDomain}.\n` + errorBaseMessage);
}

if (!projectId || projectId.trim() === "") {
    throw new Error(`Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing or invalid. Received: ${displayedProjectId}.\n` + errorBaseMessage);
}


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket || (projectId ? `${projectId}.appspot.com` : undefined),
  messagingSenderId: messagingSenderId || undefined,
  appId: appId || undefined,
  measurementId: measurementId || undefined
};

let app: FirebaseApp;
let auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}
auth = getAuth(app);

export { app, auth };
