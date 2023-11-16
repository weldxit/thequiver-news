// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyARVGSRpMWtMKVzfLQGMmS9HPWggj-699Y",
    authDomain: "the-quiver-aebd9.firebaseapp.com",
    projectId: "the-quiver-aebd9",
    storageBucket: "the-quiver-aebd9.appspot.com",
    messagingSenderId: "776795297518",
    appId: "1:776795297518:android:8c4d3843380fbffb8985ff"
    
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);