import * as actionTypes from '../actions/actionTypes';
import initialState from '../intialState';

export default function subcategoryReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_SUB_CATEGORY_SUCCESS:
      return {
        ...state,
        addSubCategoryResponse: { data: action.data, error: '' }
      };
    case actionTypes.ADD_SUB_CATEGORY_FAILED:
      return {
        ...state,
        addSubCategoryResponse: { data: '', error: action.error }
      };
    case actionTypes.FETCH_SUB_CATEGORY_SUCCESS:
      return {
        ...state,
        subCategories: { data: action.data, error: '' }
      };
    case actionTypes.FETCH_SUB_CATEGORY_FAILED:
      return {
        ...state,
        subCategories: { data: [], error: action.error }
      };
    case actionTypes.DELETE_SUB_CATEGORY_SUCCESS:
      return {
        ...state,
        deleteSubCategoryResponse: { data: action.data, error: '' }
      };
    case actionTypes.DELETE_SUB_CATEGORY_FAILED:
      return {
        ...state,
        deleteSubCategoryResponse: { data: '', error: action.error }
      };
    case actionTypes.UPDATE_SUB_CATEGORY_STATUS_SUCCESS:
      return {
        ...state,
        updateStatusResponse: { data: action.data, error: '' }
      };
    case actionTypes.UPDATE_SUB_CATEGORY_STATUS_FAILED:
      return {
        ...state,
        updateStatusResponse: { data: '', error: action.error }
      };
    case actionTypes.GET_SUB_CATEGORY_BY_ID_SUCCESS:
      return {
        ...state,
        subCategoryResponse: { data: action.data, error: '' }
      };
    case actionTypes.GET_SUB_CATEGORY_BY_ID_FAILED:
      return {
        ...state,
        subCategoryResponse: { data: '', error: action.error }
      };
    case actionTypes.UPDATE_SUB_CATEGORY_SUCCESS:
      return {
        ...state,
        updateSubCategoryResponse: { data: action.data, error: '' }
      };
    case actionTypes.UPDATE_SUB_CATEGORY_FAILED:
      return {
        ...state,
        updateSubCategoryResponse: { data: '', error: action.error }
      };

    default:
      return state;
  }
}
