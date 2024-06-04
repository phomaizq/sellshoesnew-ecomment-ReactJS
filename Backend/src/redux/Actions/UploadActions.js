import {
  UPLOAD_DELETE_FAIL,
  UPLOAD_DELETE_REQUEST,
  UPLOAD_DELETE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_RESET,
  UPLOAD_IMAGE_SUCCESS,
} from "../Constants/UploadConstants";
import axios from "axios";
import { logout } from "./UserActions";

// Upload image
export const uploadImage = (image) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPLOAD_IMAGE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };
    const { data } = await axios.post(`/api/upload`, image, config);
    dispatch({ type: UPLOAD_IMAGE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: UPLOAD_IMAGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Delete product
export const deleteUploadImage = (image) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPLOAD_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    await axios.post(
      `/api/upload/destroy`,
      { public_id: image.public_id },
      config
    );

    dispatch({ type: UPLOAD_DELETE_SUCCESS });
    dispatch({ type: UPLOAD_IMAGE_RESET });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: UPLOAD_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
