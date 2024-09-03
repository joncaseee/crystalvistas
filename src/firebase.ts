import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCTab6K2qZfjvU-3vxl30p9_jrsNi0wQ5s",
    authDomain: "crystalvistas-6cefc.firebaseapp.com",
    projectId: "crystalvistas-6cefc",
    storageBucket: "crystalvistas-6cefc.appspot.com",
    messagingSenderId: "777825992543",
    appId: "1:777825992543:web:04732efda60ae4f5c080ea",
    measurementId: "G-GF4E6BNKBS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };