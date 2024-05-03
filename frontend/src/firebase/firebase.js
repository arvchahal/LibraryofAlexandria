import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; 

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
const auth = getAuth(app);
const db = getDatabase(app); 

export { app, auth, db }; // Export db here along with app and auth
