import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDCOyuhWrJ8CBEz4x9rSTL7NUHC6znP5zw",
    authDomain: "puntodoctor.firebaseapp.com",
    projectId: "puntodoctor",
    storageBucket: "puntodoctor.appspot.com",
    messagingSenderId: "311987829388",
    appId: "1:311987829388:web:ab39e3f51bc25b165599a9",
    measurementId: "G-K6B1YTFFGR"
  }

  export const firebaseApp = firebase.initializeApp(firebaseConfig);