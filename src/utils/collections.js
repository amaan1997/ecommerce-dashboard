import { firestore } from '../utils/firebase';

const categoryCollection = firestore.collection('category');
const subCategoryCollection = firestore.collection('subCategory');
const vendorCollection = firestore.collection('vendors');
const productCollection = firestore.collection('products');
const couponCollection = firestore.collection('coupons');

export {
  categoryCollection,
  subCategoryCollection,
  vendorCollection,
  productCollection,
  couponCollection
};
