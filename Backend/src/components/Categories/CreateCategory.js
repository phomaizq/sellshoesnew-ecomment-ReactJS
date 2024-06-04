import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createCategory } from "../../redux/Actions/CategoryActions";
import { CATEGORY_CREATE_RESET } from "../../redux/Constants/CategoryConstants";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import Toast from "../LoadingError/Toast";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 3000,
};

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  const categoryCreate = useSelector((state) => state.categoryCreate);
  const { loading, error, category } = categoryCreate;

  useEffect(() => {
    if (category) {
      toast.success("Category Added", ToastObjects);
      dispatch({ type: CATEGORY_CREATE_RESET });
      setName("");
      setDescription("");
    }
  }, [category, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createCategory(name, description));
  };

  return (
    <>
      <Toast />
      <div className="col-md-12 col-lg-4">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
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
              <button className="btn btn-primary py-3">Publish now</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default CreateCategory;
