
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3XrQIOWx07CNNsQHWe6i5oDOvrErIuIY",
  authDomain: "booksync-4ca88.firebaseapp.com",
  projectId: "booksync-4ca88",
  storageBucket: "booksync-4ca88.firebasestorage.app",
  messagingSenderId: "642750798106",
  appId: "1:642750798106:web:488f0bfa70fda3c24c34a3",
  measurementId: "G-E2J0Z1QWR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
