import * as actionTypes from './actionTypes';
import {
  auth,
  addDocumentAtRef,
  uploadMultiImage,
  getAllImageDownloadUrls
} from '../../utils/firebase';
import {
  productCollection,
  subCategoryCollection,
  vendorCollection,
  categoryCollection
} from '../../utils/collections';

export const addProduct = data => {
  return async dispatch => {
    try {
      const {
        name,
        brand,
        actualPrice,
        discount,
        categoryId,
        subCategoryId,
        vendorId,
        specification,
        status,
        productImages,
        description,
        selectedSize
      } = data;

      const productRef = productCollection.doc();
      const productId = productRef.id;
      const path = `${auth.currentUser.uid}/products/${productId}`;

      const imageUrls = await uploadMultiImage(productImages, path);

      let product = await productCollection
        .where('isDeleted', '==', false)
        .orderBy('index', 'desc')
        .limit(1)
        .get();

      let index = 1;

      if (product && product.docs && product.docs[0]) {
        index = product.docs[0].data().index + 1;
      }
      let finalPrice = Math.round(
        actualPrice - (actualPrice * discount) / 100,
        0
      );
      await addDocumentAtRef(productRef, {
        name,
        brand,
        actualPrice,
        discount,
        finalPrice,
        categoryId,
        subCategoryId,
        vendorId,
        specification,
        status,
        productImages: imageUrls,
        description,
        sizeAvailable: selectedSize,
        isDeleted: false,
        index: index
      });
      dispatch(addProductSuccess('Product Added Successfully!'));
    } catch (error) {
      dispatch(addProductFailed(error.message));
    }
  };
};
export const addProductSuccess = data => ({
  type: actionTypes.ADD_PRODUCT_SUCCESS,
  data
});
export const addProductFailed = error => ({
  type: actionTypes.ADD_PRODUCT_FAILED,
  error
});

export const fetchProducts = data => {
  const { pageNumber, pageSize } = data;
  return async dispatch => {
    try {
      let product = await productCollection
        .where('isDeleted', '==', false)
        .orderBy('index', 'desc')
        .limit(1)
        .get();

      let index = 1;
      if (product && product.docs && product.docs[0]) {
        index = product.docs[0].data().index;
      }
      console.log('data>>', data);
      console.log('index>>', index);

      const startIndex = index - (pageNumber - 1) * pageSize;
      console.log('startIndex>>', startIndex);
      let products = await productCollection
        .where('isDeleted', '==', false)
        .orderBy('index', 'desc')
        .startAt(startIndex)
        .limit(pageSize)
        .get();

      console.log('products1>>>>', products);
      const productRef = await productCollection
        .where('isDeleted', '==', false)
        .get();
      const size = productRef.size;

      let response = [];
      for (let productDoc of products.docs) {
        let result = { ...productDoc.data() };

        response.push({
          name: result.name,
          brand: result.brand,
          actualPrice: result.actualPrice,
          discount: result.discount,
          sizeAvailable: result.sizeAvailable,
          status: result.status,
          finalPrice: result.finalPrice,
          productId: productDoc.id
        });
      }
      dispatch(fetchProductsSuccess({ data: response, totalCount: size }));
    } catch (error) {
      console.log('error', error.message);
      dispatch(fetchProductsFailed(error.message));
    }
  };
};
export const fetchProductsSuccess = response => ({
  type: actionTypes.FETCH_PRODUCTS_SUCCESS,
  response
});
export const fetchProductsFailed = error => ({
  type: actionTypes.FETCH_PRODUCTS_FAILED,
  error
});

export const deleteProduct = productId => {
  return async dispatch => {
    try {
      let productRef = await productCollection.doc(productId);

      await productRef.update({
        isDeleted: true
      });
      dispatch(deleteProductSuccess('Product deleted successfully!'));
    } catch (error) {
      dispatch(deleteProductFailed(error.message));
    }
  };
};

export const deleteProductSuccess = data => ({
  type: actionTypes.DELETE_PRODUCT_SUCCESS,
  data
});
export const deleteProductFailed = error => ({
  type: actionTypes.DELETE_PRODUCT_FAILED,
  error
});
export const getProductDetail = productId => {
  console.log('productId', productId);
  return async dispatch => {
    try {
      let productRef = await productCollection.doc(productId).get();
      let categoryName = '';
      let subCategoryName = '';
      let vendorName = '';

      let result = productRef.data();
      let categoryRef = await categoryCollection.doc(result.categoryId).get();
      if (categoryRef && categoryRef.data()) {
        categoryName = categoryRef.data().name;
      }
      let subCategoryRef = await subCategoryCollection
        .doc(result.subCategoryId)
        .get();
      if (subCategoryRef && subCategoryRef.data()) {
        subCategoryName = subCategoryRef.data().name;
      }
      let vendorRef = await vendorCollection.doc(result.vendorId).get();
      if (vendorRef && vendorRef.data()) {
        vendorName = vendorRef.data().name;
      }

      result['imageUrls'] = await getAllImageDownloadUrls(result.productImages);

      let data = {
        name: result.name,
        brand: result.brand,
        actualPrice: result.actualPrice,
        discount: result.discount,
        imageUrls: result.imageUrls,
        categoryName: categoryName,
        description: result.description,
        sizeAvailable: result.sizeAvailable,
        specification: result.specification,
        status: result.status,
        subCategoryName: subCategoryName,
        vendorName: vendorName,
        finalPrice: result.finalPrice
      };
      console.log('data>>>', data);
      dispatch(getProductDetailSuccess(data));
    } catch (error) {
      dispatch(getProductDetailFailed(error.message));
    }
  };
};

export const getProductDetailSuccess = data => ({
  type: actionTypes.GET_PRODUCT_DETAIL_SUCCESS,
  data
});
export const getProductDetailFailed = error => ({
  type: actionTypes.GET_PRODUCT_DETAIL_FAILED,
  error
});
