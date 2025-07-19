// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBEwXQqoeWQLhr4kIs8GELlwLSe8Ep-1dA",
  authDomain: "hackzilla-app.firebaseapp.com",
  projectId: "hackzilla-app",
  storageBucket: "hackzilla-app.firebasestorage.app",
  messagingSenderId: "244654351609",
  appId: "1:244654351609:web:c8e9e8e70846ee0334ae28",
  measurementId: "G-W1R7BLGG0G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
