// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWU3mKtLbiLSGgewOWsbvqiuinpr5f8sk",
    authDomain: "quiver-b4b65.firebaseapp.com",
    projectId: "quiver-b4b65",
    storageBucket: "quiver-b4b65.appspot.com",
    messagingSenderId: "216007132332",
    appId: "1:216007132332:android:9b533adb45badd9b03cb09"
    
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
