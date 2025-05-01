import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCDP_N9fYjlJnshuc4jckOP5IMo0HSrbmo",
  authDomain: "pafmain-a0be6.firebaseapp.com",
  projectId: "pafmain-a0be6",
  storageBucket: "pafmain-a0be6.appspot.com",
  messagingSenderId: "136832715572",
  appId: "1:136832715572:web:ac62d5fc2f9bb35cfff361"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyAX7I2K0Rmi12NyWG6HRmnKo3a_fRwkSsc",
//   authDomain: "brainboosters-d2872.firebaseapp.com",
//   projectId: "brainboosters-d2872",
//   storageBucket: "brainboosters-d2872.firebasestorage.app",
//   messagingSenderId: "316278308724",
//   appId: "1:316278308724:web:24483777e3a6eb6f2ff621"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
