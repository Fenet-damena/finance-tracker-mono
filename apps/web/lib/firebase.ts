import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsEzgLd4u8ZZq7tyafYahdG0lwxtpuYxo",
  authDomain: "finance-tracker-84f19.firebaseapp.com",
  projectId: "finance-tracker-84f19",
  storageBucket: "finance-tracker-84f19.firebasestorage.app",
  messagingSenderId: "26749493161",
  appId: "1:26749493161:web:975404f4e8b45f3bea2eb8",
  measurementId: "G-3QD3H3GWKG",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const firestoreDatabaseId = process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID;

export const db = firestoreDatabaseId
  ? getFirestore(app, firestoreDatabaseId)
  : getFirestore(app);