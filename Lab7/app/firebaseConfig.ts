import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_31nKpRIvl-eYt_jUCHzoEbiTcAHDm-E",
  authDomain: "cro102-reactnative-21854.firebaseapp.com",
  projectId: "cro102-reactnative-21854",
  storageBucket: "cro102-reactnative-21854.firebasestorage.app",
  messagingSenderId: "52212537964",
  appId: "1:52212537964:web:8b0ff1d840df77f4a69649",
  measurementId: "G-3S8VELRY37"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

export { auth }; 
