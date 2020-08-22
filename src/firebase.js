import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyC_w8Ux3Ro02kPtAInTivmI9j552CCCLqM",
    authDomain: "zwemvijver-wot-88407.firebaseapp.com",
    databaseURL: "https://zwemvijver-wot-88407.firebaseio.com",
    projectId: "zwemvijver-wot-88407",
    storageBucket: "zwemvijver-wot-88407.appspot.com",
    messagingSenderId: "745830505037",
    appId: "1:745830505037:web:a8a7a5c4daa0aec7b31a04",
    measurementId: "G-9XWS20LSQ5"
  };
  // Initialize Firebase
  firebase.initializeApp(config);
  firebase.analytics();

  //je kan meerdere dingen exporten, maar wel 1 ding default
  export const auth = firebase.auth();
  export const db = firebase.firestore();

  export default firebase;


  