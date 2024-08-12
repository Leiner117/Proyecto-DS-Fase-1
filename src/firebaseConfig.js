import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVP08ILD0FH3SUfh7w92MwLSj5PVapA2o",
  authDomain: "recetariotec.firebaseapp.com",
  projectId: "recetariotec",
  storageBucket: "recetariotec.appspot.com",
  messagingSenderId: "502429065023",
  appId: "1:502429065023:web:c645b01ccf30714585bd8a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

const logOut = () => {
  return signOut(auth);
};

export { auth, signInWithGoogle, logOut };