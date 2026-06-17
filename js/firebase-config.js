// Firebase Configuration for Fekra Shop
// Import the SDKs you need from the SDKs you need from CDNs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// TODO: Replace the following config with your own Firebase project configuration
// You can get this from the Firebase Console: Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyBCectKNws3gehaK9e0Bpt324TKRhHg28c",
  authDomain: "fekra-shop.firebaseapp.com",
  projectId: "fekra-shop",
  storageBucket: "fekra-shop.firebasestorage.app",
  messagingSenderId: "714262868705",
  appId: "1:714262868705:web:47cd63ef22a14876d23da0",
  measurementId: "G-S343B14WYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
