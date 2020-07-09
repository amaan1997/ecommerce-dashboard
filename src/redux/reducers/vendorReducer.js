import * as actionTypes from '../actions/actionTypes';
import initialState from '../intialState';

export default function vendorReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_VENDORS_SUCCESS:
      return {
        ...state,
        vendorList: { data: action.data, error: '' }
      };
    case actionTypes.GET_VENDORS_FAILED:
      return {
        ...state,
        vendorList: { data: '', error: action.error }
      };
    case actionTypes.ADD_VENDOR_SUCCESS:
      return {
        ...state,
        addVendorResponse: { data: action.data, error: '' }
      };
    case actionTypes.ADD_VENDOR_FAILED:
      return {
        ...state,
        addVendorResponse: { data: '', error: action.error }
      };
    case actionTypes.FETCH_VENDOR_DETAILS_SUCCESS:
      return {
        ...state,
        vendorDetails: { data: action.data, error: '' }
      };
    case actionTypes.FETCH_VENDOR_DETAILS_FAILED:
      return {
        ...state,
        vendorDetails: { data: '', error: action.error }
      };
    case actionTypes.DELETE_VENDOR_SUCCESS:
      return {
        ...state,
        deleteVendorResponse: { data: action.data, error: '' }
      };
    case actionTypes.DELETE_VENDOR_FAILED:
      return {
        ...state,
        deleteVendorResponse: { data: '', error: action.error }
      };
    case actionTypes.GET_VENDOR_BY_ID_SUCCESS:
      return {
        ...state,
        vendorByIdResponse: { data: action.data, error: '' }
      };
    case actionTypes.DELETE_VENDOR_FAILED:
      return {
        ...state,
        vendorByIdResponse: { data: '', error: action.error }
      };

    default:
      return state;
  }
}
