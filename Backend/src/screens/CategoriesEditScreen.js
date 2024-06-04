import React from "react";
import Sidebar from "./../components/sidebar";
import Header from "./../components/Header";
import EditCategory from "../components/Categories/EditCategory";

const CategoryEditScreen = ({ match }) => {
  const categoryId = match.params.id;
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <EditCategory categoryId={categoryId} />
      </main>
    </>
  );
};
export default CategoryEditScreen;
