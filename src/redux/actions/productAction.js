import * as actionTypes from './actionTypes';
import 'firebase/auth';
import {
  auth,
  uploadImage,
  addDocumentAtRef,
  getDownloadUrl,
  updateDocumentAtRef,
  storage,
  isFileExist
} from '../../utils/firebase';
import { categoryCollection } from '../../utils/collections';
import { getFileNameByPath } from '../../utils/data';

export const addCategory = data => {
  return async dispatch => {
    try {
      const { categoryName, categoryImage, categoryType } = data;

      const categoryRef = categoryCollection.doc();
      const categoryId = categoryRef.id;
      const path = `${auth.currentUser.uid}/category/${categoryId}`;

      let categoryImageUrl = await uploadImage(categoryImage, path);

      await addDocumentAtRef(categoryRef, {
        name: categoryName,
        imageUrl: categoryImageUrl,
        type: categoryType,
        isActive: true,
        isDeleted: false
      });
      dispatch(addCategorySuccess('Successfully Category Added!'));
    } catch (error) {
      dispatch(addCategoryFailed(error.message));
    }
  };
};
export const addCategorySuccess = data => ({
  type: actionTypes.ADD_CATEGORY_SUCCESS,
  data
});
export const addCategoryFailed = error => ({
  type: actionTypes.ADD_CATEGORY_FAILED,
  error
});

export const fetchCategory = () => {
  return async dispatch => {
    try {
      let categories = await categoryCollection
        .where('isDeleted', '==', false)
        .get();

      let response = [];
      for (let categoryDoc of categories.docs) {
        let result = { ...categoryDoc.data() };
        let imageUrl = await getDownloadUrl(result.imageUrl);
        result.imageUrl = imageUrl;
        let active = result.isActive;
        result.isActive = {
          active,
          categoryId: categoryDoc.id
        };
        response.push({
          ...result,
          categoryId: categoryDoc.id
        });
      }
      dispatch(fetchCategorySuccess(response));
    } catch (error) {
      dispatch(fetchCategoryFailed(error.message));
    }
  };
};
export const fetchCategorySuccess = data => ({
  type: actionTypes.FETCH_CATEGORY_SUCCESS,
  data
});
export const fetchCategoryFailed = error => ({
  type: actionTypes.FETCH_CATEGORY_FAILED,
  error
});

export const deleteCategory = categoryId => {
  return async dispatch => {
    try {
      let categoryRef = await categoryCollection.doc(categoryId);

      await categoryRef.update({
        isDeleted: true
      });
      dispatch(deleteCategorySuccess('Category deleted successfully!'));
    } catch (error) {
      dispatch(deleteCategoryFailed(error.message));
    }
  };
};

export const deleteCategorySuccess = data => ({
  type: actionTypes.DELETE_CATEGORY_SUCCESS,
  data
});
export const deleteCategoryFailed = error => ({
  type: actionTypes.DELETE_CATEGORY_FAILED,
  error
});

export const updateCategoryStatus = (categoryId, isActive) => {
  return async dispatch => {
    try {
      let categoryRef = await categoryCollection.doc(categoryId);

      await updateDocumentAtRef(categoryRef, { isActive: !isActive });

      dispatch(
        updateCategoryStatusSuccess('Category status updated successfully!')
      );
    } catch (error) {
      dispatch(updateCategoryStatusFailed(error.message));
    }
  };
};

export const updateCategoryStatusSuccess = data => ({
  type: actionTypes.UPDATE_CATEGORY_STATUS_SUCCESS,
  data
});
export const updateCategoryStatusFailed = error => ({
  type: actionTypes.UPDATE_CATEGORY_STATUS_FAILED,
  error
});

export const getCategoryById = categoryId => {
  return async dispatch => {
    try {
      let categoryRef = await categoryCollection.doc(categoryId).get();

      let response = categoryRef.data();

      let category = {};

      const imageUrl = await getDownloadUrl(response.imageUrl);
      const fileName = getFileNameByPath(response.imageUrl);
      category.fileList = [
        { uid: -1, name: fileName, status: 'done', url: imageUrl }
      ];
      category.categoryName = response.name;
      category.categoryType = response.type;

      dispatch(getCategoryByIdSuccess(category));
    } catch (error) {
      dispatch(getCategoryByIdFailed(error.message));
    }
  };
};

export const getCategoryByIdSuccess = data => ({
  type: actionTypes.GET_CATEGORY_BY_ID_SUCCESS,
  data
});
export const getCategoryByIdFailed = error => ({
  type: actionTypes.GET_CATEGORY_BY_ID_FAILED,
  error
});

export const updateCategory = (data, categoryId) => {
  return async dispatch => {
    try {
      const { categoryName, categoryImage, categoryType } = data;
      const categoryRef = await categoryCollection.doc(categoryId);
      const categoryDoc = await categoryCollection.doc(categoryId).get();
      const response = categoryDoc.data();
      const fileName = getFileNameByPath(response.imageUrl);
      let result = {
        name: categoryName,
        type: categoryType
      };
      if (fileName === categoryImage.name) {
        await updateDocumentAtRef(categoryRef, result);
      } else {
        if (isFileExist(response.imageUrl)) {
          await storage.ref(response.imageUrl).delete();
        }
        const path = `${auth.currentUser.uid}/category/${categoryRef.id}`;
        const categoryImageUrl = await uploadImage(categoryImage, path);
        result.imageUrl = categoryImageUrl;
        await updateDocumentAtRef(categoryCollection.doc(categoryId), result);
      }
      dispatch(updateCategorySuccess('Successfully updated Category'));
    } catch (error) {
      dispatch(updateCategoryFailed(error.message));
    }
  };
};

export const updateCategorySuccess = data => ({
  type: actionTypes.UPDATE_CATEGORY_SUCCESS,
  data
});
export const updateCategoryFailed = error => ({
  type: actionTypes.UPDATE_CATEGORY_FAILED,
  error
});

export const fetchCategoryTypes = () => {
  return async dispatch => {
    try {
      let categories = await categoryCollection
        .where('isDeleted', '==', false)
        .get();

      let response = [];
      for (let categoryDoc of categories.docs) {
        let result = { ...categoryDoc.data() };

        response.push({
          label: result.name,
          value: categoryDoc.id
        });
      }
      dispatch(fetchCategoryTypesSuccess(response));
    } catch (error) {
      dispatch(fetchCategoryTypesFailed(error.message));
    }
  };
};
export const fetchCategoryTypesSuccess = data => ({
  type: actionTypes.FETCH_CATEGORY_TYPES_SUCCESS,
  data
});
export const fetchCategoryTypesFailed = error => ({
  type: actionTypes.FETCH_CATEGORY_TYPES_FAILED,
  error
});
