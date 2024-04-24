// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUD61oBDMJczC4K5NgAUjGTkoyf207PXI",
  authDomain: "libofalex-8397c.firebaseapp.com",
  projectId: "libofalex-8397c",
  storageBucket: "libofalex-8397c.appspot.com",
  messagingSenderId: "274994854192",
  appId: "1:274994854192:web:6fe9d9d633da1841a670f5",
  measurementId: "G-NZEB6FHYDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);