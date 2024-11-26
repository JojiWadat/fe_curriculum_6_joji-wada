import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAU68rH5ztIbw_JmHIqGaDn3I0lDXXciDE",
    authDomain: "term6-joji-wada.firebaseapp.com",
    projectId: "term6-joji-wada",
    storageBucket: "term6-joji-wada.firebasestorage.app",
    messagingSenderId: "612823786737",
    appId: "1:612823786737:web:36f33a67fd61af2c7cb550"
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// Firebase Authenticationのインスタンスを取得
export const fireAuth = getAuth(app);
