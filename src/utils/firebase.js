import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

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
export const storage = firebase.storage();
const storageRef = firebase.storage().ref();
const FieldValue = firebase.firestore.FieldValue;

export const uploadImage = (imageFile, path) => {
  let imageUrl = '';

  const fileName = imageFile.name;
  let filePath = `${path}/${fileName}`;

  let imageRef = storageRef.child(filePath);

  return imageRef.put(imageFile.originFileObj).then(snapshot => {
    console.log('snapshot', snapshot);
    if (snapshot.state === 'success') {
      return snapshot.metadata.fullPath;
    } else {
      return '';
    }
  });
};
export const isFileExist = async filePath => {
  let fileRef = storageRef.child(filePath);
  const downloadUrl = await fileRef.getDownloadURL();

  if (downloadUrl) {
    return true;
  } else {
    return false;
  }
};
export const getDownloadUrl = async filePath => {
  let fileRef = storageRef.child(filePath);

  const downloadUrl = await fileRef.getDownloadURL();
  return downloadUrl;
};
export const addDocumentAtRef = async (docRef, data) => {
  console.log('docRef>>', docRef);
  console.log('data>>', data);

  const result = {
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    createdBy: auth.currentUser.email,
    updatedBy: auth.currentUser.email
  };
  await docRef.set(result);
};

export const updateDocumentAtRef = async (docRef, data) => {
  const result = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: auth.currentUser.email
  };
  await docRef.update(result);
};
