import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB2dXY4JzkQaxS4DVFqOup2uNuOtgVScO4",
  authDomain: "quiz-app-ad60b.firebaseapp.com",
  projectId: "quiz-app-ad60b",
  storageBucket: "quiz-app-ad60b.appspot.com",
  messagingSenderId: "130591788277",
  appId: "1:130591788277:web:4181baaff860b9ced209bc",
  measurementId: "G-TN25VKN6C0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);