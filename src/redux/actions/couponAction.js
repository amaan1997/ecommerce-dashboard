import * as actionTypes from './actionTypes';
import { addDocumentAtRef, updateDocumentAtRef } from '../../utils/firebase';
import { couponCollection } from '../../utils/collections';

export const validateCouponCode = (
  couponCode,
  prevCouponCode = null,
  editable = false
) => {
  return async dispatch => {
    try {
      const coupons = await couponCollection
        .where('isDeleted', '==', false)
        .get();

      let count = 0;
      coupons.docs.forEach(couponDoc => {
        let result = { ...couponDoc.data() };
        if (editable) {
          if (
            result.couponCode !== prevCouponCode &&
            result.couponCode === couponCode
          ) {
            count++;
          }
        } else {
          if (result.couponCode === couponCode) {
            count++;
          }
        }
      });
      if (count === 0) {
        dispatch(validateCouponCodeSuccess());
      } else {
        dispatch(validateCouponCodeFailed());
      }
    } catch (error) {
      dispatch(validateCouponCodeFailed());
    }
  };
};
export const validateCouponCodeSuccess = data => ({
  type: actionTypes.VALIDATE_COUPON_CODE_SUCCESS,
  data
});
export const validateCouponCodeFailed = error => ({
  type: actionTypes.VALIDATE_COUPON_CODE_FAILED,
  error
});

export const addCoupon = data => {
  return async dispatch => {
    try {
      console.log('data>>', data);
      const couponRef = couponCollection.doc();
      await addDocumentAtRef(couponRef, {
        ...data,
        isDeleted: false
      });
      dispatch(addCouponSuccess('Coupon Added Successfully!'));
    } catch (error) {
      dispatch(addCouponFailed(error.message));
    }
  };
};
export const addCouponSuccess = data => ({
  type: actionTypes.ADD_COUPON_SUCCESS,
  data
});
export const addCouponFailed = error => ({
  type: actionTypes.ADD_COUPON_FAILED,
  error
});

export const fetchCoupon = () => {
  return async dispatch => {
    try {
      let coupons = await couponCollection
        .where('isDeleted', '==', false)
        .get();

      let response = [];
      for (let couponDoc of coupons.docs) {
        let result = { ...couponDoc.data() };
        response.push({
          ...result,
          couponId: couponDoc.id
        });
      }
      dispatch(fetchCouponSuccess(response));
    } catch (error) {
      dispatch(fetchCouponFailed(error.message));
    }
  };
};
export const fetchCouponSuccess = data => ({
  type: actionTypes.FETCH_COUPON_SUCCESS,
  data
});
export const fetchCouponFailed = error => ({
  type: actionTypes.FETCH_COUPON_FAILED,
  error
});

export const updateCouponStatus = (couponId, status) => {
  return async dispatch => {
    try {
      let couponRef = await couponCollection.doc(couponId);

      await updateDocumentAtRef(couponRef, { status: status });
      dispatch(updateCouponStatusSuccess('Status Updated Successfully!'));
    } catch (error) {
      dispatch(updateCouponStatusFailed(error.message));
    }
  };
};
export const updateCouponStatusSuccess = data => ({
  type: actionTypes.UPDATE_COUPON_STATUS_SUCCESS,
  data
});
export const updateCouponStatusFailed = error => ({
  type: actionTypes.UPDATE_COUPON_STATUS_FAILED,
  error
});

export const getCouponDetailsById = couponId => {
  return async dispatch => {
    try {
      let couponRef = await couponCollection.doc(couponId).get();

      let result = couponRef.data();

      dispatch(getCouponDetailsByIdSuccess(result));
    } catch (error) {
      dispatch(getCouponDetailsByIdFailed(error.message));
    }
  };
};
export const getCouponDetailsByIdSuccess = data => ({
  type: actionTypes.GET_COUPON_DETAILS_BY_ID_SUCCESS,
  data
});
export const getCouponDetailsByIdFailed = error => ({
  type: actionTypes.GET_COUPON_DETAILS_BY_ID_FAILED,
  error
});

export const deleteCoupon = couponId => {
  return async dispatch => {
    try {
      let couponRef = await couponCollection.doc(couponId);

      await updateDocumentAtRef(couponRef, {
        isDeleted: true
      });

      dispatch(deleteCouponSuccess('Coupon Deleted Successfully!'));
    } catch (error) {
      dispatch(deleteCouponFailed(error.message));
    }
  };
};
export const deleteCouponSuccess = data => ({
  type: actionTypes.DELETE_COUPON_SUCCESS,
  data
});
export const deleteCouponFailed = error => ({
  type: actionTypes.DELETE_COUPON_FAILED,
  error
});

export const updateCoupon = (couponId, data) => {
  return async dispatch => {
    try {
      let couponRef = await couponCollection.doc(couponId);

      await updateDocumentAtRef(couponRef, {
        ...data
      });

      dispatch(updateCouponSuccess('Coupon Updated Successfully!'));
    } catch (error) {
      dispatch(updateCouponFailed(error.message));
    }
  };
};
export const updateCouponSuccess = data => ({
  type: actionTypes.UPDATE_COUPON_SUCCESS,
  data
});
export const updateCouponFailed = error => ({
  type: actionTypes.UPDATE_COUPON_FAILED,
  error
});
