import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_EXPENSE_TRACKER_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_EXPENSE_TRACKER_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_EXPENSE_TRACKER_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_EXPENSE_TRACKER_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_EXPENSE_TRACKER_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_EXPENSE_TRACKER_APP_ID,
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth ,db};

