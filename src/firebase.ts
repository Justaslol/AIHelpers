import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyACR6ee2Tf7L1sn0ZkYTUBpCQ5UVCovvuM",
    authDomain: "sintra-test-app.firebaseapp.com",
    projectId: "sintra-test-app",
    storageBucket: "sintra-test-app.appspot.com",
    messagingSenderId: "410396289784",
    appId: "1:410396289784:web:470efcb4832a312a38690d"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth (without AsyncStorage)
const auth = getAuth(app);

export { auth };