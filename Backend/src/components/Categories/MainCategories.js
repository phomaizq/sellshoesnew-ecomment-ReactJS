import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { lisCategories } from "../../redux/Actions/CategoryActions";
import CategoriesTable from "./CategoriesTable";
import CreateCategory from "./CreateCategory";

const MainCategories = () => {
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const { error: errorDelete, success: successDelete } = categoryDelete;

  useEffect(() => {
    dispatch(lisCategories());
  }, [dispatch, successDelete]);

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Category</h2>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row">
            {/* Create category */}
            <CreateCategory />
            {/* Categories table */}
            <CategoriesTable
              categories={categories}
              loading={loading}
              error={error}
              errorDelete={errorDelete}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCategories;
