import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAlzEplp9KsdX74GcYWnP02FHX9VA1a23U",
  authDomain: "betterdoctorfinder.firebaseapp.com",
  databaseURL: "https://betterdoctorfinder.firebaseio.com",
  projectId: "betterdoctorfinder",
  storageBucket: "betterdoctorfinder.appspot.com",
  messagingSenderId: "514807357957",
  appId: "1:514807357957:web:85761750b00a7ad9f0726c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await getIdToken(firebaseUser);
          setUser({ uid: firebaseUser.uid, token });
        } catch (error) {
          console.error("Error getting token: ", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
