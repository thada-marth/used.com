import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAyXI2Cp8FXUVU7XZW68Dex_eUTxxQyC4M",
    authDomain: "used-14bdb.firebaseapp.com",
    projectId: "used-14bdb",
    storageBucket: "used-14bdb.appspot.com",
    messagingSenderId: "1088598994642",
    appId: "1:1088598994642:web:88b0d0d5a644072bec070b",
    measurementId: "G-FWVNJ7GCVB"
});


export default firebaseApp;
export const firestore = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();