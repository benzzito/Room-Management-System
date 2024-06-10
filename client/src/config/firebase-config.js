// Import  the firebase services to be used
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

//

// Configuration TODO: place apiKey in .env
const firebaseConfig = {
  apiKey: "AIzaSyCk32NVxYr98BuWtDlntlKm-XWhlXO7fPk",
  authDomain: "wchbooking-solution.firebaseapp.com",
  projectId: "wchbooking-solution",
  storageBucket: "wchbooking-solution.appspot.com",
  messagingSenderId: "379194268497",
  appId: "1:379194268497:web:1e0a81c1c25b9799c9d170"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const firestore = db;

export { auth, db, app, storage, firestore };