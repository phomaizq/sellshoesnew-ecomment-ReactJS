import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import Orders from "./Orders";

const OrderMain = () => {
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const [searchOrder, setSearchOrder] = useState("");
  const [statusList] = useState([
    "Paid",
    "Not Paid",
    "Paid And Delivered",
    "Paid Not Yet Delivered",
  ]);
  const [selectedStatus, setSelectedStatus] = useState();
  const [sortList] = useState([
    "Total: low -> high",
    "Total: high -> low",
    "Date: newest",
    "Date: oldest",
  ]);
  const [selectedSort, setSelectedSort] = useState();

  // Search product
  const searchOrders = orders?.filter((order) => {
    if (searchOrder === "") {
      return order;
    } else if (
      order.user.name.toLowerCase().includes(searchOrder.toLowerCase())
    ) {
      return order;
    }
  });

  // filter by Status
  const handleOrderStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const getFilterStatus = () => {
    if (!selectedStatus) {
      return searchOrders;
    } else if (selectedStatus === "Paid") {
      return searchOrders?.filter((order) => order.isPaid === true);
    } else if (selectedStatus === "Not Paid") {
      return searchOrders?.filter((order) => order.isPaid === false);
    } else if (selectedStatus === "Paid And Delivered") {
      return searchOrders?.filter(
        (order) => order.isPaid === true && order.isDelivered === true
      );
    } else if (selectedStatus === "Paid Not Yet Delivered") {
      return searchOrders?.filter(
        (order) => order.isPaid === true && order.isDelivered === false
      );
    }
  };

  const filterStatus = useMemo(getFilterStatus, [selectedStatus, searchOrders]);

  console.log(filterStatus);

  // Sort
  const handleOrderSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  const getSortOrder = () => {
    if (!selectedSort) {
      return filterStatus;
    } else if (selectedSort === "Total: low -> high") {
      return filterStatus?.sort(
        (a, b) => parseFloat(a.totalPrice) - parseFloat(b.totalPrice)
      );
    } else if (selectedSort === "Total: high -> low") {
      return filterStatus?.sort(
        (a, b) => parseFloat(b.totalPrice) - parseFloat(a.totalPrice)
      );
    } else if (selectedSort === "Date: newest") {
      return filterStatus?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (selectedSort === "Date: oldest") {
      return filterStatus?.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }
  };

  const sortOrders = useMemo(getSortOrder, [selectedSort, filterStatus]);

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Orders</h2>
      </div>

      <div className="card mb-4 shadow-sm">
        <header className="card-header bg-white">
          <div className="row gx-3 py-3">
            <div className="col-lg-4 col-md-6 me-auto">
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                onChange={(e) => setSearchOrder(e.target.value)}
              />
            </div>
            <div className="col-lg-2 col-6 col-md-3">
              <select
                name="orderStatus"
                className="form-select"
                onChange={handleOrderStatusChange}
              >
                <option value="">Select a status</option>
                {statusList.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-2 col-6 col-md-3">
              <select
                name="orderSort"
                className="form-select"
                onChange={handleOrderSortChange}
              >
                <option value="">Select a sort</option>
                {sortList.map((sort) => (
                  <option value={sort} key={sort}>
                    {sort}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>
        <div className="card-body">
          <div className="table-responsive">
            {loading ? (
              <Loading />
            ) : error ? (
              <Message variant="alert-danger">{error}</Message>
            ) : (
              <Orders sortOrders={sortOrders} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderMain;
