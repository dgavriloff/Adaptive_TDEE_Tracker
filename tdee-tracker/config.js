import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyCE75CUet8Dwf1wuQ5bx3T3KLN_s4Wz1Ys",
  authDomain: "adaptive-tdee-tracker.firebaseapp.com",
  projectId: "adaptive-tdee-tracker",
  storageBucket: "adaptive-tdee-tracker.appspot.com",
  messagingSenderId: "1004983932814",
  appId: "1:1004983932814:web:e8d7c112885f0f86f6b6df",
  measurementId: "G-8V03ESB82C"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db }