// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// 1. KAILANGAN NATIN 'TONG IMPORTS NA 'TO PARA SA AUTH AT DATABASE
import { getAuth, signInAnonymously, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdyD_rGV7lucs8fqTk2I7ZBW1YRvfiOks",
  authDomain: "crimsoncloudhr.firebaseapp.com",
  projectId: "crimsoncloudhr",
  storageBucket: "crimsoncloudhr.firebasestorage.app",
  messagingSenderId: "244371402335",
  appId: "1:244371402335:web:149687e962e2984c22b5ea",
  measurementId: "G-GQZHQS1L6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🛡️ APP CHECK — must run before any Firestore/Auth call (see HR app for details).
if (import.meta.env.DEV) {
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN || true;
}
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
if (recaptchaSiteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
} else {
  console.warn("App Check disabled: VITE_RECAPTCHA_SITE_KEY is not set.");
}

export const analytics = getAnalytics(app);

// 2. KAILANGAN NATIN 'TONG I-EXPORT PARA MA-ACCESS NG LOGIN.TSX
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Applicants get a silent ANONYMOUS session (persisted in this browser), so
 * Firestore never accepts unauthenticated writes and "My Applications" can
 * show only this visitor's own applications.
 */
export async function ensureApplicantSession(): Promise<User> {
  await auth.authStateReady();
  return auth.currentUser ?? (await signInAnonymously(auth)).user;
}