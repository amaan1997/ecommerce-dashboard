import * as actionTypes from '../actions/actionTypes';
import initialState from '../intialState';

export default function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        addCategoryResponse: { data: action.data, error: '' }
      };
    case actionTypes.ADD_CATEGORY_FAILED:
      return {
        ...state,
        addCategoryResponse: { data: '', error: action.error }
      };
    case actionTypes.FETCH_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: { data: action.data, error: '' }
      };
    case actionTypes.FETCH_CATEGORY_FAILED:
      return {
        ...state,
        categories: { data: [], error: action.error }
      };
    case actionTypes.DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        deleteCategoryResponse: { data: action.data, error: '' }
      };
    case actionTypes.DELETE_CATEGORY_FAILED:
      return {
        ...state,
        deleteCategoryResponse: { data: '', error: action.error }
      };
    case actionTypes.UPDATE_CATEGORY_STATUS_SUCCESS:
      return {
        ...state,
        updateStatusResponse: { data: action.data, error: '' }
      };
    case actionTypes.UPDATE_CATEGORY_STATUS_FAILED:
      return {
        ...state,
        updateStatusResponse: { data: '', error: action.error }
      };
    case actionTypes.GET_CATEGORY_BY_ID_SUCCESS:
      return {
        ...state,
        categoryResponse: { data: action.data, error: '' }
      };
    case actionTypes.GET_CATEGORY_BY_ID_FAILED:
      return {
        ...state,
        categoryResponse: { data: '', error: action.error }
      };
    case actionTypes.UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        updateCategoryResponse: { data: action.data, error: '' }
      };
    case actionTypes.UPDATE_CATEGORY_FAILED:
      return {
        ...state,
        updateCategoryResponse: { data: '', error: action.error }
      };
    case actionTypes.FETCH_CATEGORY_TYPES_SUCCESS:
      return {
        ...state,
        categoryTypes: { data: action.data, error: '' }
      };
    case actionTypes.FETCH_CATEGORY_TYPES_FAILED:
      return {
        ...state,
        categoryTypes: { data: '', error: action.error }
      };
    default:
      return state;
  }
}
