import { firestore } from '../utils/firebase';

const categoryCollection = firestore.collection('category');
const subCategoryCollection = firestore.collection('subCategory');

export { categoryCollection, subCategoryCollection };
