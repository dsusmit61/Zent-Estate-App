import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: 'shopkart-app-db.firebaseapp.com',
  projectId: 'shopkart-app-db',
  storageBucket: 'shopkart-app-db.appspot.com',
  messagingSenderId: '305059988865',
  appId: '1:305059988865:web:1929b8eb9fc7db10e11480',
};

export const app = initializeApp(firebaseConfig);
