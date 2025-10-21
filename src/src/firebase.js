// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVDArAVmJ0OqRyaO7awekg76Gq0wrpBig",
  authDomain: "muslimup-d4465.firebaseapp.com",
  projectId: "muslimup-d4465",
  storageBucket: "muslimup-d4465.firebasestorage.app",
  messagingSenderId: "655109598171",
  appId: "1:655109598171:web:e51f64a3aeebd514f8d5fe",
  measurementId: "G-NFMEMHYQHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
