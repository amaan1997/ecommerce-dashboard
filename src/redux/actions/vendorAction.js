import * as actionTypes from './actionTypes';
import { vendorCollection } from '../../utils/collections';
import { addDocumentAtRef } from '../../utils/firebase';

export const getVendors = () => {
  return async dispatch => {
    try {
      let vendors = await vendorCollection
        .where('isDeleted', '==', false)
        .get();
      console.log('vendors>>', vendors);

      let response = [];
      for (let vendorDoc of vendors.docs) {
        let result = { ...vendorDoc.data() };

        response.push({
          label: result.name,
          value: vendorDoc.id
        });
      }
      console.log('response>>', response);
      dispatch(getVendorsSuccess(response));
    } catch (error) {
      dispatch(getVendorsFailed(error.message));
    }
  };
};

export const getVendorsSuccess = data => ({
  type: actionTypes.GET_VENDORS_SUCCESS,
  data
});
export const getVendorsFailed = error => ({
  type: actionTypes.GET_VENDORS_FAILED,
  error
});

export const addVendor = data => {
  return async dispatch => {
    try {
      const vendorRef = vendorCollection.doc();

      await addDocumentAtRef(vendorRef, {
        ...data,
        isDeleted: false
      });
      dispatch(addVendorSuccess('Vendor added successfully!'));
    } catch (error) {
      dispatch(addVendorFailed(error.message));
    }
  };
};

export const addVendorSuccess = data => ({
  type: actionTypes.ADD_VENDOR_SUCCESS,
  data
});
export const addVendorFailed = error => ({
  type: actionTypes.ADD_VENDOR_FAILED,
  error
});

export const fetchVendorDetails = () => {
  return async dispatch => {
    try {
      let vendors = await vendorCollection
        .where('isDeleted', '==', false)
        .get();

      let response = [];
      for (let vendorDoc of vendors.docs) {
        let result = { ...vendorDoc.data() };
        response.push({
          ...result,
          vendorId: vendorDoc.id
        });
      }
      dispatch(fetchVendorDetailsSuccess(response));
    } catch (error) {
      dispatch(fetchVendorDetailsFailed(error.message));
    }
  };
};

export const fetchVendorDetailsSuccess = data => ({
  type: actionTypes.FETCH_VENDOR_DETAILS_SUCCESS,
  data
});
export const fetchVendorDetailsFailed = error => ({
  type: actionTypes.FETCH_VENDOR_DETAILS_FAILED,
  error
});

export const deleteVendor = vendorId => {
  return async dispatch => {
    try {
      let vendorRef = await vendorCollection.doc(vendorId);

      await vendorRef.update({
        isDeleted: true
      });
      dispatch(deleteVendorSuccess('Vendor deleted successfully!'));
    } catch (error) {
      dispatch(deleteVendorFailed(error.message));
    }
  };
};

export const deleteVendorSuccess = data => ({
  type: actionTypes.DELETE_VENDOR_SUCCESS,
  data
});
export const deleteVendorFailed = error => ({
  type: actionTypes.DELETE_VENDOR_FAILED,
  error
});

export const getVendorById = vendorId => {
  return async dispatch => {
    try {
      let vendorRef = await vendorCollection.doc(vendorId).get();

      let response = vendorRef.data();

      dispatch(getVendorByIdSuccess(response));
    } catch (error) {
      dispatch(getVendorByIdFailed(error.message));
    }
  };
};

export const getVendorByIdSuccess = data => ({
  type: actionTypes.GET_VENDOR_BY_ID_SUCCESS,
  data
});
export const getVendorByIdFailed = error => ({
  type: actionTypes.GET_VENDOR_BY_ID_FAILED,
  error
});
