// src/firebase.js
import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAlzEplp9KsdX74GcYWnP02FHX9VA1a23U",
  authDomain: "betterdoctorfinder.firebaseapp.com",
  databaseURL: "https://betterdoctorfinder.firebaseio.com",
  projectId: "betterdoctorfinder",
  storageBucket: "betterdoctorfinder.appspot.com",
  messagingSenderId: "514807357957",
  appId: "1:514807357957:web:85761750b00a7ad9f0726c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, database };