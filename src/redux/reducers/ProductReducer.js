import * as actionTypes from '../actions/actionTypes';
import initialState from '../intialState';

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        addProductResponse: { data: action.data, error: '' }
      };
    case actionTypes.ADD_PRODUCT_FAILED:
      return {
        ...state,
        addProductResponse: { data: '', error: action.error }
      };

    case actionTypes.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        productList: {
          data: action.response.data,
          totalCount: action.response.totalCount,
          error: ''
        }
      };

    case actionTypes.FETCH_PRODUCTS_FAILED:
      return {
        ...state,
        productList: { data: {}, totalCount: 1, error: action.error }
      };
    case actionTypes.DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        deleteProductResponse: { data: action.data, error: '' }
      };
    case actionTypes.DELETE_PRODUCT_FAILED:
      return {
        ...state,
        deleteProductResponse: { data: '', error: action.error }
      };
    case actionTypes.GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        productDetail: { data: action.data, error: '' }
      };
    case actionTypes.GET_PRODUCT_DETAIL_FAILED:
      return {
        ...state,
        productDetail: { data: '', error: action.error }
      };
    default:
      return state;
  }
}
