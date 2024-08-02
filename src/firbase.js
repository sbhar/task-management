// src/firebase.js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAlzEplp9KsdX74GcYWnP02FHX9VA1a23U",
  authDomain: "betterdoctorfinder.firebaseapp.com",
  databaseURL: "https://betterdoctorfinder.firebaseio.com",
  projectId: "betterdoctorfinder",
  storageBucket: "betterdoctorfinder.appspot.com",
  messagingSenderId: "514807357957",
  appId: "1:514807357957:web:85761750b00a7ad9f0726c"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const database = firebase.database();
