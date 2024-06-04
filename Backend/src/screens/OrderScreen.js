import React, { useEffect } from "react";
import Sidebar from "./../components/sidebar";
import Header from "./../components/Header";
import OrderMain from "../components/orders/OrderMain";
import { useDispatch } from "react-redux";
import { listOrders } from "../redux/Actions/OrderActions";

const OrderScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <OrderMain />
      </main>
    </>
  );
};

export default OrderScreen;
