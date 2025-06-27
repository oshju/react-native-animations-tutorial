import { getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyChHgfa9l8Q0FpUPgKMarcQ0T5VKo54Wl8",
  authDomain: "fir-flutter-b6550.firebaseapp.com",
  projectId: "fir-flutter-b6550",
  storageBucket: "fir-flutter-b6550.appspot.com",
  messagingSenderId: "241671563610",
  appId: "1:241671563610:web:4fcde083ee9ad2f8652b63"
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log('Firebase initialized:', app.name); 