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
import {
  subCategoryCollection,
  categoryCollection
} from '../../utils/collections';
import { getFileNameByPath } from '../../utils/data';

export const addSubCategory = data => {
  return async dispatch => {
    try {
      const { subCategoryName, subCategoryImage, categoryId } = data;

      const subCategoryRef = subCategoryCollection.doc();
      const subCategoryId = subCategoryRef.id;
      const path = `${auth.currentUser.uid}/subCategory/${subCategoryId}`;

      let subCategoryImageUrl = await uploadImage(subCategoryImage, path);

      await addDocumentAtRef(subCategoryRef, {
        name: subCategoryName,
        imageUrl: subCategoryImageUrl,
        categoryId,
        isActive: true,
        isDeleted: false
      });
      dispatch(addSubCategorySuccess('Sub Category Added Successfully!'));
    } catch (error) {
      dispatch(addSubCategoryFailed(error.message));
    }
  };
};
export const addSubCategorySuccess = data => ({
  type: actionTypes.ADD_SUB_CATEGORY_SUCCESS,
  data
});
export const addSubCategoryFailed = error => ({
  type: actionTypes.ADD_SUB_CATEGORY_FAILED,
  error
});

export const fetchSubCategory = () => {
  return async dispatch => {
    try {
      let subCategories = await subCategoryCollection
        .where('isDeleted', '==', false)
        .get();

      let response = [];
      let categoryName = '';
      for (let subCategoryDoc of subCategories.docs) {
        let result = { ...subCategoryDoc.data() };
        let imageUrl = await getDownloadUrl(result.imageUrl);
        result.imageUrl = imageUrl;
        let active = result.isActive;
        let categoryRef = await categoryCollection
          .doc(subCategoryDoc.data().categoryId)
          .get();
        if (categoryRef && categoryRef.data()) {
          categoryName = categoryRef.data().name;
        }
        result.categoryType = categoryName;

        result.isActive = {
          active,
          subCategoryId: subCategoryDoc.id
        };
        response.push({
          ...result,
          subCategoryId: subCategoryDoc.id
        });
      }
      dispatch(fetchSubCategorySuccess(response));
    } catch (error) {
      dispatch(fetchSubCategoryFailed(error.message));
    }
  };
};
export const fetchSubCategorySuccess = data => ({
  type: actionTypes.FETCH_SUB_CATEGORY_SUCCESS,
  data
});
export const fetchSubCategoryFailed = error => ({
  type: actionTypes.FETCH_SUB_CATEGORY_FAILED,
  error
});

export const deleteSubCategory = subCategoryId => {
  return async dispatch => {
    try {
      let subCategoryRef = await subCategoryCollection.doc(subCategoryId);

      await subCategoryRef.update({
        isDeleted: true
      });
      dispatch(deleteSubCategorySuccess('SUB Category deleted successfully!'));
    } catch (error) {
      dispatch(deleteSubCategoryFailed(error.message));
    }
  };
};

export const deleteSubCategorySuccess = data => ({
  type: actionTypes.DELETE_SUB_CATEGORY_SUCCESS,
  data
});
export const deleteSubCategoryFailed = error => ({
  type: actionTypes.DELETE_SUB_CATEGORY_FAILED,
  error
});

export const updateSubCategoryStatus = (subCategoryId, isActive) => {
  return async dispatch => {
    try {
      let subCategoryRef = await subCategoryCollection.doc(subCategoryId);

      await updateDocumentAtRef(subCategoryRef, { isActive: !isActive });

      dispatch(
        updateSubCategoryStatusSuccess(
          'Sub Category status updated successfully!'
        )
      );
    } catch (error) {
      dispatch(updateSubCategoryStatusFailed(error.message));
    }
  };
};

export const updateSubCategoryStatusSuccess = data => ({
  type: actionTypes.UPDATE_SUB_CATEGORY_STATUS_SUCCESS,
  data
});
export const updateSubCategoryStatusFailed = error => ({
  type: actionTypes.UPDATE_SUB_CATEGORY_STATUS_FAILED,
  error
});

export const getSubCategoryById = subCategoryId => {
  return async dispatch => {
    try {
      let subCategoryRef = await subCategoryCollection.doc(subCategoryId).get();

      let response = subCategoryRef.data();

      let subCategory = {};

      const imageUrl = await getDownloadUrl(response.imageUrl);
      const fileName = getFileNameByPath(response.imageUrl);
      subCategory.fileList = [
        { uid: -1, name: fileName, status: 'done', url: imageUrl }
      ];
      subCategory.subCategoryName = response.name;
      let categoryRef = await categoryCollection.doc(response.categoryId).get();
      let categoryType = '';
      if (categoryRef && categoryRef.data()) {
        categoryType = categoryRef.data().name;
      }
      subCategory.categoryType = categoryType;

      dispatch(getSubCategoryByIdSuccess(subCategory));
    } catch (error) {
      dispatch(getSubCategoryByIdFailed(error.message));
    }
  };
};

export const getSubCategoryByIdSuccess = data => ({
  type: actionTypes.GET_SUB_CATEGORY_BY_ID_SUCCESS,
  data
});
export const getSubCategoryByIdFailed = error => ({
  type: actionTypes.GET_SUB_CATEGORY_BY_ID_FAILED,
  error
});

export const updateSubCategory = (data, subCategoryId) => {
  return async dispatch => {
    try {
      const { subCategoryName, subCategoryImage, categoryId } = data;
      let subCategoryRef = await subCategoryCollection.doc(subCategoryId);
      const subCategoryDoc = await subCategoryCollection
        .doc(subCategoryId)
        .get();
      const response = subCategoryDoc.data();
      const fileName = getFileNameByPath(response.imageUrl);
      let result = {
        name: subCategoryName,
        categoryId
      };
      console.log('data>>action', data);
      console.log('result', result);

      if (fileName === subCategoryImage.name) {
        await updateDocumentAtRef(subCategoryRef, result);
      } else {
        if (isFileExist(response.imageUrl)) {
          await storage.ref(response.imageUrl).delete();
        }
        const path = `${auth.currentUser.uid}/subCategory/${subCategoryRef.id}`;
        const subCategoryImageUrl = await uploadImage(subCategoryImage, path);
        result.imageUrl = subCategoryImageUrl;
        console.log('result', result);
        await updateDocumentAtRef(subCategoryRef, result);
      }
      dispatch(updateSubCategorySuccess('Sub Category updated successfully'));
    } catch (error) {
      dispatch(updateSubCategoryFailed(error.message));
    }
  };
};

export const updateSubCategorySuccess = data => ({
  type: actionTypes.UPDATE_SUB_CATEGORY_SUCCESS,
  data
});
export const updateSubCategoryFailed = error => ({
  type: actionTypes.UPDATE_SUB_CATEGORY_FAILED,
  error
});
