import * as actionTypes from './actionTypes';
import firebase from 'firebase/app';
import { firestore, auth } from '../../utils/firebase';
import 'firebase/auth';

export const loginWithEmailRequest = data => {
  const { email, password } = data;
  return async dispatch => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async response => {
        let email = response.user.email;
        let userId = auth.currentUser.uid;
        console.log('userId', userId);
        console.log('email', email);
        console.log('response', response);

        let userDetails = await firestore.collection('users').doc(userId).get();
        const data = {
          ...userDetails.data(),
          email
        };
        dispatch(loginWithEmailSuccess(data));
      })
      .catch(error => {
        console.log('error>>', error);
        dispatch(loginWithEmailFailed(error.message));
      });
  };
};

export const loginWithEmailSuccess = data => ({
  type: actionTypes.LOGIN_WITH_EMAIL_SUCCESS,
  data
});
export const loginWithEmailFailed = error => ({
  type: actionTypes.LOGIN_WITH_EMAIL_FAILED,
  error
});
