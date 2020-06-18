import * as actionTypes from '../actions/actionTypes';
import initialState from '../intialState';

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOGIN_WITH_EMAIL_SUCCESS:
      console.log('tes>>', action.data);
      return { ...state, user: { data: action.data, error: '' } };
    case actionTypes.LOGIN_WITH_EMAIL_FAILED:
      return { ...state, user: { data: {}, error: action.error } };
    default:
      return state;
  }
}
