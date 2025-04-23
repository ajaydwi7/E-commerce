import React from "react";
import OrderDetails from "./OrderDetails/OrderDetails";
import OrderSummary from "./OrderSummary/OrderSummary";
import EmptyState from "./EmptyState/EmptyState";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import "./Order.css";

const Order = () => {
  const { serviceStore } = useGlobalContext(); // Use serviceStore to access cart
  const { cart, cartQuantity } = serviceStore.state;

  return (
    <div className="main-order-container">
      <div className="view-order">
        <div className="order-title">
          <h2>Order</h2>
          <h2>{cartQuantity} Items</h2>
        </div>
        <div className="order-container">
          {cart.length > 0 ? (
            cart.map((service) => (
              <OrderDetails
                key={`${service.serviceId}-${JSON.stringify(
                  service.selectedVariations?.map(v => v.optionId).sort() || ''
                )}`}
                service={service}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
      <div className="order-summary">
        <h2>Order Summary</h2>
        <OrderSummary />
      </div>
    </div>
  );
};

export default Order;
