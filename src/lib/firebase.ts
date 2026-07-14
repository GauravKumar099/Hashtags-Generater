import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "dev-technique-w40ks",
  appId: "1:358419196948:web:fe715b0a2632c613f34b01",
  apiKey: "AIzaSyDB7zor7KqCNHQ2uoYCPbryfm_59N6cjqs",
  authDomain: "dev-technique-w40ks.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-37c7d9e5-341d-457c-9a40-3674c1906031",
  storageBucket: "dev-technique-w40ks.firebasestorage.app",
  messagingSenderId: "358419196948"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
