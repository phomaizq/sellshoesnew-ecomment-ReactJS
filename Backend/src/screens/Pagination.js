import React from "react";
import { Link } from "react-router-dom";

const Pagination = ({ productsPerPage, totalProducts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center">
        <li className="page-item disabled">
          <Link className="page-link" to="#">
            Previous
          </Link>
        </li>
        {pageNumbers.map((number) => (
          <li className={`page-item active`} key={number}>
            <Link
              onClick={() => paginate(number)}
              className="page-link"
              to={"#"}
            >
              {number}
            </Link>
          </li>
        ))}
        <li className="page-item">
          <Link className="page-link" to="#">
            Next
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
