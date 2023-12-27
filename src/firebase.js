// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAO0C_0haCT1asAPV6MnLCRbQhz4idYAog",
    authDomain: "biofloc-sns-27991.firebaseapp.com",
    projectId: "biofloc-sns-27991",
    storageBucket: "biofloc-sns-27991.appspot.com",
    messagingSenderId: "527760566674",
    appId: "1:527760566674:android:9b533adb45badd9b03cb09"
    
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
