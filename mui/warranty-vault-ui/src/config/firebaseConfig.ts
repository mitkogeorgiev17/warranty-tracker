// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseApp = {
  apiKey: "AIzaSyCIgULn9aQ3kufQTNqG5xS4kXZqocupJa8",
  authDomain: "supple-voyage-458619-j4.firebaseapp.com",
  projectId: "supple-voyage-458619-j4",
  storageBucket: "supple-voyage-458619-j4.firebasestorage.app",
  messagingSenderId: "1046524391013",
  appId: "1:1046524391013:web:9947a7e8c897ace23e608c",
  measurementId: "G-N2E2MZN5HN"
};

// Initialize Firebase
const app = initializeApp(firebaseApp);

export const messaging = getMessaging(app);

export const VAPID_KEY = "BFBkDVoAwoi2tCPVnfpvoVARusNdjxzjy589gdOFSeeePzD_Uxn5VUEf3rZNmx_f-gyuP5_BBZI1JLH4k0UnMaU";