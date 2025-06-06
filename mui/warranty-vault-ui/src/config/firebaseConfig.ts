// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from 'firebase/messaging';
import { Capacitor } from "@capacitor/core";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCIgULn9aQ3kufQTNqG5xS4kXZqocupJa8",
  authDomain: "supple-voyage-458619-j4.firebaseapp.com",
  projectId: "supple-voyage-458619-j4",
  storageBucket: "supple-voyage-458619-j4.firebasestorage.app",
  messagingSenderId: "1046524391013",
  appId: "1:1046524391013:web:9947a7e8c897ace23e608c",
  measurementId: "G-N2E2MZN5HN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize messaging in web environment
export let messaging: any = null;

// Check if we're in a web environment that supports Firebase messaging
const isWebEnvironment = !Capacitor.isNativePlatform() && 
  typeof window !== 'undefined' && 
  'serviceWorker' in navigator;

if (isWebEnvironment) {
  try {
    messaging = getMessaging(app);
    console.log('Firebase messaging initialized for web');
  } catch (error) {
    console.warn('Failed to initialize Firebase messaging:', error);
    messaging = null;
  }
} else {
  console.log('Skipping Firebase messaging initialization (not in web environment)');
}

export const VAPID_KEY = "BFBkDVoAwoi2tCPVnfpvoVARusNdjxzjy589gdOFSeeePzD_Uxn5VUEf3rZNmx_f-gyuP5_BBZI1JLH4k0UnMaU";