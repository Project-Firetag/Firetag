// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0yAJnC95Zu7sIIMz0uSp3dDMT4fbjbLk",
  authDomain: "firetag-89547.firebaseapp.com",
  projectId: "firetag-89547",
  storageBucket: "firetag-89547.appspot.com",
  messagingSenderId: "189206675295",
  appId: "1:189206675295:web:be355cfed6de96883a80ea",
  measurementId: "G-JHPHY1BVJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export async function login(email: string, password: string) {
  console.log(app, db, auth)
  async function isAuthorized(email: string) {
    const res = await getDoc(doc(db, "authorized", email));
    const exists = res.exists();
    return exists
  }
  const authorized = await isAuthorized(email);
  if(authorized) {
    createUserWithEmailAndPassword(auth, email, password)
    .then((res) => {
      console.log(res)
    })
    .catch((e) => {
      console.error(e)
    })
  }
}