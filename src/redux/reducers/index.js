import { combineReducers } from 'redux';
import auth from './AuthReducer';
import product from './ProductReducer';
import subCategory from './SubCategoryReducer';

const rootReducer = combineReducers({
  auth,
  product,
  subCategory
});

export default rootReducer;
