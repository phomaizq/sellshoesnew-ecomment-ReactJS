import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteCategory } from "../../redux/Actions/CategoryActions";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";

const CategoriesTable = (props) => {
  const { loading, error, categories, errorDelete, isEdit } = props;

  const dispatch = useDispatch();

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure ?")) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="col-md-12 col-lg-8">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            {isEdit ? "" : <th className="text-end">Action</th>}
          </tr>
        </thead>
        {/* Table Data */}
        {errorDelete && (
          <tbody>
            <tr>
              <th colSpan={4}>
                <Message variant="alert-danger">{errorDelete}</Message>
              </th>
            </tr>
          </tbody>
        )}
        {loading ? (
          <tbody>
            <tr>
              <th colSpan={4}>
                <Loading />
              </th>
            </tr>
          </tbody>
        ) : error ? (
          <tbody>
            <tr>
              <th colSpan={4}>
                <Message variant="alert-danger">{error}</Message>
              </th>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category._id}</td>
                <td>
                  <b>{category.name}</b>
                </td>
                <td>{category.description}</td>
                {isEdit ? (
                  ""
                ) : (
                  <td className="text-end">
                    <div className="dropdown">
                      <Link
                        to="#"
                        data-bs-toggle="dropdown"
                        className="btn btn-light"
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </Link>
                      <div className="dropdown-menu">
                        <Link
                          className="dropdown-item"
                          to={`/categories/${category._id}`}
                        >
                          Edit info
                        </Link>
                        <Link
                          className="dropdown-item text-danger"
                          to="#"
                          onClick={() => deleteHandler(category._id)}
                        >
                          Delete
                        </Link>
                      </div>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default CategoriesTable;
