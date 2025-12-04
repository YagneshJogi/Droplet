// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqzpMhxTOIVjFwCVcy7h7m1IILL-dDH4c",
  authDomain: "aavishkar-8f0b9.firebaseapp.com",
  projectId: "aavishkar-8f0b9",
  databaseURL: "https://aavishkar-8f0b9-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "aavishkar-8f0b9.firebasestorage.app",
  messagingSenderId: "651138895844",
  appId: "1:651138895844:web:f4b1aadd08383619cfc1f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database
export const database = getDatabase(app); 