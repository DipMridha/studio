
// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const placeholderApiKey = "YOUR_API_KEY";
const placeholderAuthDomain = "YOUR_AUTH_DOMAIN";
const placeholderProjectId = "YOUR_PROJECT_ID";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

const commonApiKeyPlaceholderPattern = "YOUR_API_KEY";

// Since authentication is removed, we'll be less strict with throwing errors
// if the API key is a placeholder, to allow other Firebase services (like Genkit)
// to potentially still function if they have their own config or don't rely on these client-side vars.
// However, if you intend to use client-side Firebase services that *do* need these,
// they still need to be correctly set.

let displayedApiKey = apiKey ? `'${apiKey}'` : "'Not Set (Missing NEXT_PUBLIC_FIREBASE_API_KEY)'";
if (apiKey && apiKey.includes(commonApiKeyPlaceholderPattern)) {
  displayedApiKey = `'${apiKey}' (Common placeholder pattern '${commonApiKeyPlaceholderPattern}' detected)`;
}

// Removed strict error throwing for missing API keys, as auth is removed.
// console.log(`Firebase Initializing with API Key: ${displayedApiKey}`);
// if (!apiKey || apiKey.trim() === "" || apiKey.includes(commonApiKeyPlaceholderPattern)) {
//   console.warn( // Changed from throw new Error to console.warn
//     `Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, a placeholder, or invalid. Received: ${displayedApiKey}.\n` +
//     `Authentication features will not work. Other Firebase services might also be affected if they rely on this client-side config.\n` +
//     `Troubleshooting steps:\n` +
//     `1. Firebase Studio: Ensure your Firebase project is correctly linked and syncing environment variables with their ACTUAL values.\n` +
//     `2. Local Development: Verify your '.env.local' file in the project root. It MUST contain your actual Firebase project credentials. Example:\n` +
//     `   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy............" (This must be your real key from Firebase Console)\n` +
//     `   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"\n` +
//     `   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"\n` +
//     `   (and other NEXT_PUBLIC_FIREBASE_... variables. Ensure they are ACTUAL values from your Firebase console and NOT placeholders like "YOUR_PROJECT_ID" or "your-project-id" if that's not your real project ID.)\n` +
//     `3. IMPORTANT: After creating or editing the '.env.local' file, you MUST restart your Next.js development server for changes to take effect.\n` +
//     `4. Double-check that the values copied from your Firebase console are exact and have no typos or extra characters (like quotes unless they are part of the key itself, which is rare for API keys).`
//   );
// }

// if (!authDomain || authDomain.trim() === "" || authDomain.includes(placeholderAuthDomain)) {
//     console.warn("Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) is missing or a placeholder. Authentication features will not work.");
// }
// if (!projectId || projectId.trim() === "" || projectId.includes(placeholderProjectId))
//     console.warn("Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing or a placeholder. Some Firebase services might not work correctly.");


const firebaseConfig = {
  apiKey: apiKey, // Will be undefined or placeholder if not set
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket || (projectId ? `${projectId}.appspot.com` : undefined),
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};

let app: FirebaseApp;
let auth: Auth | null = null; // Auth can be null if not properly configured or not needed

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
      auth = getAuth(app);
    } else {
      console.warn("Firebase Authentication not initialized due to missing configuration (API Key, Auth Domain, or Project ID).");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase app:", error);
    // app will remain undefined, and auth null
  }
} else {
  app = getApp();
  if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
     auth = getAuth(app);
  } else {
      console.warn("Firebase Authentication not initialized for existing app due to missing configuration (API Key, Auth Domain, or Project ID).");
  }
}


export { app, auth };
