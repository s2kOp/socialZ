// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth , signInWithEmailAndPassword , createUserWithEmailAndPassword , GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPoZSZ_rZlCHEbfT3THyXFbdh3y1Z8YpU",
  authDomain: "socialz-72591.firebaseapp.com",
  projectId: "socialz-72591",
  storageBucket: "socialz-72591.firebasestorage.app",
  messagingSenderId: "364627066856",
  appId: "1:364627066856:web:000756f10bd58c740e2e5d",
  measurementId: "G-XJ4KM28MVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
export const db = getFirestore(app);
provider.setCustomParameters({
  prompt: "select_account", // 👈 forces Google account chooser
});
export {provider};

export const firebaseSignIn = (auth, email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

export const firebaseCreateAccount = (auth, email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
