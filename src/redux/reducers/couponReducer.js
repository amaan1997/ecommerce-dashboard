import * as actionTypes from '../actions/actionTypes';
import initialState from '../intialState';

export default function couponReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.VALIDATE_COUPON_CODE_SUCCESS:
      return { ...state, isCouponCodeValid: true };
    case actionTypes.VALIDATE_COUPON_CODE_FAILED:
      return { ...state, isCouponCodeValid: false };
    case actionTypes.ADD_COUPON_SUCCESS:
      return { ...state, addCouponResponse: { data: action.data, error: '' } };
    case actionTypes.ADD_COUPON_FAILED:
      return { ...state, addCouponResponse: { data: '', error: action.error } };
    case actionTypes.FETCH_COUPON_SUCCESS:
      return { ...state, couponList: { data: action.data, error: '' } };
    case actionTypes.FETCH_COUPON_FAILED:
      return { ...state, couponList: { data: [], error: action.error } };
    case actionTypes.UPDATE_COUPON_STATUS_SUCCESS:
      return {
        ...state,
        updateCouponStatusResponse: { data: action.data, error: '' }
      };
    case actionTypes.UPDATE_COUPON_STATUS_FAILED:
      return {
        ...state,
        updateCouponStatusResponse: { data: '', error: action.error }
      };
    case actionTypes.GET_COUPON_DETAILS_BY_ID_SUCCESS:
      return { ...state, couponById: { data: action.data, error: '' } };
    case actionTypes.GET_COUPON_DETAILS_BY_ID_FAILED:
      return { ...state, couponById: { data: '', error: action.error } };

    case actionTypes.UPDATE_COUPON_SUCCESS:
      return {
        ...state,
        updateCouponResponse: { data: action.data, error: '' }
      };
    case actionTypes.UPDATE_COUPON_FAILED:
      return {
        ...state,
        updateCouponResponse: { data: '', error: action.error }
      };

    case actionTypes.DELETE_COUPON_SUCCESS:
      return {
        ...state,
        deleteCouponResponse: { data: action.data, error: '' }
      };
    case actionTypes.DELETE_COUPON_FAILED:
      return {
        ...state,
        deleteCouponResponse: { data: '', error: action.error }
      };
    default:
      return state;
  }
}
