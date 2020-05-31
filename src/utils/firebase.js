import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAvcaTPezly-GHxAeX9l-URE_RVFEiXdX4',
  authDomain: 'ecommerce-deb9a.firebaseapp.com',
  databaseURL: 'https://ecommerce-deb9a.firebaseio.com',
  projectId: 'ecommerce-deb9a',
  storageBucket: 'ecommerce-deb9a.appspot.com',
  messagingSenderId: '900188220471',
  appId: '1:900188220471:web:5934e249ef480f4f05e3b2',
  measurementId: 'G-Z8JDV2SFRV'
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
