import {
  UPLOAD_DELETE_FAIL,
  UPLOAD_DELETE_REQUEST,
  UPLOAD_DELETE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_RESET,
  UPLOAD_IMAGE_SUCCESS,
} from "../Constants/UploadConstants";

// Upload image
export const imageUploadReducer = (state = { image: {} }, action) => {
  switch (action.type) {
    case UPLOAD_IMAGE_REQUEST:
      return { loading: true };
    case UPLOAD_IMAGE_SUCCESS:
      return { loading: false, success: true, image: action.payload };
    case UPLOAD_IMAGE_FAIL:
      return { loading: false, error: action.payload };
    case UPLOAD_IMAGE_RESET:
      return { image: {} };
    default:
      return state;
  }
};

// Delete upload
export const imageDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case UPLOAD_DELETE_REQUEST:
      return { loading: true };
    case UPLOAD_DELETE_SUCCESS:
      return { loading: false, success: true };
    case UPLOAD_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
