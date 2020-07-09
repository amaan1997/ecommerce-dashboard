import { combineReducers } from 'redux';
import auth from './AuthReducer';
import category from './categoryReducer';
import subCategory from './SubCategoryReducer';
import vendor from './vendorReducer';
import product from './productReducer';
import coupon from './couponReducer';

const rootReducer = combineReducers({
  auth,
  category,
  subCategory,
  vendor,
  product,
  coupon
});

export default rootReducer;
