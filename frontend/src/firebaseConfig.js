import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
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
//   apiKey: "AIzaSyAEpBvNjMtNuSHkwIWnyikPBExvTAi-QU8",
//   authDomain: "uee-project-7e802.firebaseapp.com",
//   projectId: "uee-project-7e802",
//   storageBucket: "uee-project-7e802.appspot.com",
//   messagingSenderId: "513594411651",
//   appId: "1:513594411651:web:6d7a0b216431a283dc29b6"
// };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const auth = getAuth(app);
export const storage = getStorage(app);
