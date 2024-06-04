import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  editCategory,
  lisCategories,
  updateCategory,
} from "../../redux/Actions/CategoryActions";
import { CATEGORY_UPDATE_RESET } from "../../redux/Constants/CategoryConstants";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import Toast from "../LoadingError/Toast";
import CategoriesTable from "./CategoriesTable";

const ToastObject = {
  pauseOnFocusLoss: false,
  draggble: false,
  pauseOnHover: false,
  autoClose: 3000,
};

const EditCategory = (props) => {
  const { categoryId } = props;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading: loadingList, error: errorList, categories } = categoryList;

  const categoryEdit = useSelector((state) => state.categoryEdit);
  const { error, category } = categoryEdit;

  const categoryUpdate = useSelector((state) => state.categoryUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = categoryUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: CATEGORY_UPDATE_RESET });
      toast.success("Category Updated", ToastObject);
    } else {
      if (!category.name || category._id !== categoryId) {
        dispatch(editCategory(categoryId));
      } else {
        setName(category.name);
        setDescription(category.description);
        setIsEdit(true);
        dispatch(lisCategories());
      }
    }
  }, [category, dispatch, categoryId, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateCategory({ _id: categoryId, name, description }));
  };

  return (
    <>
      <Toast />
      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title">Update Category</h2>
          <div>
            <Link to="/category" className="btn btn-primary">
              Create category
            </Link>
          </div>
        </div>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row">
              {/* update */}
              {errorUpdate && (
                <Message variant="alert-danger">{errorUpdate}</Message>
              )}
              {loadingUpdate ? (
                <Loading />
              ) : error ? (
                <Message variant="alert-danger">{error}</Message>
              ) : (
                <div className="col-md-12 col-lg-4">
                  <form onSubmit={submitHandler}>
                    <div className="mb-4">
                      <label htmlFor="product_name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="form-control py-3"
                        id="product_name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Description</label>
                      <textarea
                        placeholder="Type here"
                        className="form-control"
                        rows="4"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary py-3">
                        Update now
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* table */}
              <CategoriesTable
                loadingList={loadingList}
                errorList={errorList}
                categories={categories}
                isEdit={isEdit}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditCategory;
