// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtZVIEpjdrJ3l14dw1h5bcN_EwxCzgjQs",
  authDomain: "muslimup-28563.firebaseapp.com",
  projectId: "muslimup-28563",
  storageBucket: "muslimup-28563.firebasestorage.app",
  messagingSenderId: "180209314247",
  appId: "1:180209314247:web:2c3cce9eb51de0bd15d1e2",
  measurementId: "G-ZEDVD9W737"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
