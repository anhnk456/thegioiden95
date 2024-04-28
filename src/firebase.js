// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfunVaQuajiZrE9gsZVzl0P9laEAPhL70",
  authDomain: "thegioiden95-6e36c.firebaseapp.com",
  projectId: "thegioiden95-6e36c",
  storageBucket: "thegioiden95-6e36c.appspot.com",
  messagingSenderId: "434427142589",
  appId: "1:434427142589:web:85cd92325b16defbb532d4",
  measurementId: "G-MGLZPDDTER",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getStorage } from "firebase/storage";
const storage = getStorage(app);

export { storage };
