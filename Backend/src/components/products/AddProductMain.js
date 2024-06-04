import React, { useEffect, useRef, useState } from "react";
import { Img } from "react-image";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { lisCategories } from "../../redux/Actions/CategoryActions";
import { createProduct } from "../../redux/Actions/ProductActions";
import {
  deleteUploadImage,
  uploadImage,
} from "../../redux/Actions/UploadActions";
import { PRODUCT_CREATE_RESET } from "../../redux/Constants/ProductConstants";
import { UPLOAD_IMAGE_RESET } from "../../redux/Constants/UploadConstants";
import Message from "./../LoadingError/Error";
import Loading from "./../LoadingError/Loading";
import Toast from "./../LoadingError/Toast";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 3000,
};

const AddProductMain = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, product } = productCreate;

  const categoryList = useSelector((state) => state.categoryList);
  const { loading: loadingList, error: errorList, categories } = categoryList;

  const imageUpload = useSelector((state) => state.imageUpload);
  const { loading: loadingImage, error: errorImage, image } = imageUpload;

  const imageDelete = useSelector((state) => state.imageDelete);
  const { success: successDelete } = imageDelete;

  useEffect(() => {
    dispatch(lisCategories());
    if (product) {
      toast.success("Product Added", ToastObjects);
      dispatch({ type: PRODUCT_CREATE_RESET });
      dispatch({ type: UPLOAD_IMAGE_RESET });
      resetFileInput();
      setName("");
      setPrice(0);
      setCountInStock(0);
      setDescription("");
      setCategory("");
    }
  }, [product, dispatch, successDelete]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct(name, price, countInStock, description, category, image)
    );
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file) {
        return alert("File not exist");
      }
      if (file.size > 1024 * 1024) {
        return alert("Size too large");
      }
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return alert("File fotmat is incorrect");
      }
      let formData = new FormData();
      formData.append("file", file);
      dispatch(uploadImage(formData));
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteUpload = async () => {
    try {
      dispatch(deleteUploadImage(image));
      resetFileInput();
    } catch (error) {
      alert(error.message);
    }
  };

  const resetFileInput = () => {
    inputRef.current.value = null;
  };

  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/products" className="btn btn-danger text-white">
              Go to products
            </Link>
            <h2 className="content-title">Create product</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Publish now
              </button>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-xl-8 col-lg-8">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {error && <Message variant="alert-danger">{error}</Message>}
                  {loading && <Loading />}
                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      Product title
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="product_title"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="product_price" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      placeholder="Type here"
                      className="form-control"
                      id="product_price"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="product_countInStock"
                      className="form-label"
                    >
                      Count In Stock
                    </label>
                    <input
                      type="number"
                      placeholder="Type here"
                      className="form-control"
                      id="product_countInStock"
                      required
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Description</label>
                    <textarea
                      placeholder="Type here"
                      className="form-control"
                      rows="7"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Categories</label>
                    {loadingList ? (
                      <Loading />
                    ) : errorList ? (
                      <Message variant="alert-danger">{errorList}</Message>
                    ) : (
                      <select
                        name="category"
                        className="form-select"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option value={category._id} key={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <div className="mb-4">
                    <label className="form-label">Image</label>
                    <input
                      id="previewImg"
                      className="form-control"
                      type="file"
                      ref={inputRef}
                      onChange={handleUpload}
                      hidden
                    />
                  </div>
                  <div className="mb-4">
                    {loadingImage ? (
                      <Loading />
                    ) : errorImage ? (
                      <>
                        <div className="d-grid gap-2">
                          <label
                            className="mb-4 btn btn-outline-success"
                            htmlFor="previewImg"
                          >
                            Chose Image <i className="fas fa-upload"></i>
                          </label>
                        </div>
                        <Message variant="alert-danger">{errorImage}</Message>
                      </>
                    ) : Object.keys(image).length !== 0 ? (
                      <>
                        <div
                          className="mb-4 btn btn-danger"
                          onClick={deleteUpload}
                        >
                          Delete image
                        </div>
                        <Img
                          style={{
                            width: "100%",
                            height: "250px",
                            background: "center center no-repeat",
                            cursor: "pointer",
                          }}
                          src={image.url}
                        />
                      </>
                    ) : (
                      <>
                        <div className="d-grid gap-2">
                          <label
                            className="mb-4 btn btn-outline-success"
                            htmlFor="previewImg"
                          >
                            Chose Image <i className="fas fa-upload"></i>
                          </label>
                        </div>
                        <Message variant="alert-info">
                          No Image, please upload.
                        </Message>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddProductMain;
