import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyChHgfa9l8Q0FpUPgKMarcQ0T5VKo54Wl8",
  authDomain: "fir-flutter-b6550.firebaseapp.com",
  projectId: "fir-flutter-b6550",
  storageBucket: "fir-flutter-b6550.appspot.com",
  messagingSenderId: "241671563610",
  appId: "1:241671563610:web:4fcde083ee9ad2f8652b63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Export everything needed
export { app, auth, onAuthStateChanged };
 