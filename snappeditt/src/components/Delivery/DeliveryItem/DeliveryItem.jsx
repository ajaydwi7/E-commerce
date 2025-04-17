import React, { useState, useEffect } from "react";
import { FaCaretUp, FaDownload } from "react-icons/fa";
import { useGlobalContext } from "../../GlobalContext/GlobalContext";
import "./DeliveryItem.css";

const DeliveryItem = ({ order: initialOrder }) => {
  const [expanded, setExpanded] = useState(false);
  const [order, setOrder] = useState(initialOrder); // Local state for the order
  const [loading, setLoading] = useState(false);

  const [cancelling, setCancelling] = useState(false);

  const { auth, orders } = useGlobalContext(); // Access auth and orders from global context

  const currentDate = new Date();
  const formattedDate = new Date(order.expected_delivery_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const calculateRemainingDays = () => {
    const deliveryDate = new Date(order.expected_delivery_date);
    if (currentDate > deliveryDate) {
      return "0";
    }
    return Math.ceil((deliveryDate - currentDate) / (1000 * 60 * 60 * 24));
  };

  const toggleExpanded = () => setExpanded(!expanded);

  const getFlairStyle = () => {
    if (order.order_cancelled || order.status === "Cancelled") {
      return "flair danger-flair";
    }
    if (order.percentage_complete < 50) {
      return "flair danger-flair"; // Red for pending orders
    }
    if (order.percentage_complete < 90) {
      return "flair warning-flair"; // Yellow for in-progress orders
    }
    return "flair success-flair"; // Green for completed orders
  };

  const getFlairText = () => {
    if (order.order_cancelled || order.status === "Cancelled") {
      return "Order Cancelled";
    }
    if (order.percentage_complete < 50) {
      return "Verification Pending";
    }
    if (order.percentage_complete < 90) {
      return "Verified & In Delivery";
    }
    return "Delivered";
  };

  const fetchOrderStatus = async () => {
    setLoading(true);
    try {
      const userId = auth.state.user?.id; // Get the current user's ID
      if (!userId) {
        throw new Error("User ID is missing");
      }

      // Fetch orders for the current user
      const userOrders = await orders.fetchOrders(userId);

      // Update the order state with the fetched orders
      if (userOrders && userOrders.length > 0) {
        setOrder(userOrders[0]); // Assuming you want to display the first order
      }
    } catch (error) {
      console.error("Error fetching order status:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setCancelling(true);
      try {
        // Optimistic UI update
        setOrder(prev => ({
          ...prev,
          status: "Cancelled",
          order_cancelled: true,
          percentage_complete: 0
        }));

        // API call
        const updatedOrder = await orders.cancelOrder(order._id);

        // Update with server response
        setOrder(updatedOrder);
      } catch (error) {
        console.error("Error cancelling order:", error);
        // Revert on error
        setOrder(initialOrder);
        alert("Failed to cancel order. Please try again.");
      } finally {
        setCancelling(false);
      }
    }
  };

  useEffect(() => {
    fetchOrderStatus(); // Fetch the latest status when the component mounts
  }, []);

  return (
    <div className="sub-container delivery-item-container">
      {loading ? (
        <p>Loading order details...</p>
      ) : (
        <>
          <div className="delivery-overview">
            <div className="delivery-summary">
              <div className="delivery-order-number">
                <h2 className="delivery-item-title order-main" title={order._id}>
                  Order: <span>#</span>{order._id.slice(0, 6)}
                </h2>
                <div className="delivery-items">
                  <h5>Item Count: {order.items.length}</h5>
                  <h5>Total Cost: ${order.totalCost}</h5>
                  <h5>
                    Payment Status:{" "}
                    <span
                      className={`flair ${order.paymentStatus === "Completed"
                        ? "success-flair"
                        : order.paymentStatus === "Pending"
                          ? "warning-flair"
                          : "danger-flair"
                        }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </h5>
                </div>
              </div>
              <div className="delivery-progress">
                <h3 className="delivery-item-title">Complete</h3>
                <h4>
                  {order.status === "Cancelled" ? 0 : order.percentage_complete}%{" "}
                  <span className={getFlairStyle()}>{getFlairText()}</span>
                </h4>
                <progress
                  className="progress-bar"
                  value={order.order_cancelled ? 0 : order.percentage_complete}
                  max="100"
                  style={{
                    backgroundColor: order.status === "Cancelled" ? "red" : "initial",
                  }}
                ></progress>
              </div>
              <div className="delivery-date">
                <h3 className="delivery-item-title">Expected Completion</h3>
                {order.status === "Cancelled" ? (
                  <h4 className="is-cancelled">Cancelled</h4>
                ) : (
                  <h4>{formattedDate}</h4>
                )}
                {order.status === "Cancelled" ? null : (
                  <h4>{calculateRemainingDays()} day(s)</h4>
                )}
              </div>
              {order.couponCode && (
                <div className="coupon-display">
                  <h5>Coupon Applied: {order.couponCode}</h5>
                  <h5>Discount: -${order.discountApplied?.toFixed(2)}</h5>
                </div>
              )}
            </div>
            <div className={expanded ? "fully-expanded isExpanded" : "fully-expanded"}>
              <div className="services-in-delivery">
                <h3>Services in Delivery</h3>
                <div className="delivery-services">
                  {order.items.map((service) => (
                    <div className="delivery-service-item" key={service.serviceId}>
                      <img src={service.featureImage} alt={service.serviceName} width="50" />
                      <h5>Service Name: {service.serviceName}</h5>
                      <h5>Description: {service.serviceDescription}</h5>
                      <h5>Price: ${service.finalPrice}/Image</h5>
                      <h5>Quantity: {service.quantity}</h5>
                      {/* Add Selected Variations */}
                      {service.selectedVariations?.length > 0 && (
                        <div className="selected-variations">
                          <h6>Selected Options:</h6>
                          {service.selectedVariations.map((variation, index) => (
                            <div key={index} className="variation-item">
                              <span className="variation-type">{variation.variationType}:</span>
                              <span className="variation-option">{variation.optionName}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {service.formData && (
                        <div className="form-data">
                          <h6>Order Details:</h6>
                          {Object.entries(service.formData).map(([key, value]) => (
                            <p key={key}>
                              <strong>{key}:</strong> {value}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="expand-collapse-delivery">
            <button onClick={toggleExpanded}>
              {expanded ? "Collapse" : "Expand"}
              <span>
                <FaCaretUp
                  className={expanded ? "caret-delivery" : "caret-delivery caret-expanded"}
                />
              </span>
            </button>
          </div>
          {order.status !== "Cancelled" && (
            <div className="flex items-center gap-2 mt-2">
              <button
                className="btn-cancel bg-red-500 text-white rounded px-4 py-2"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>

              <a
                href={`${import.meta.env.VITE_API_URL}/order/${order._id}/invoice`}
                download
                className="flex flex-col items-center hover:text-yellow-600 transition-colors"
                title="Download invoice"
              >
                <FaDownload className=" text-primaryRed w-5 h-5" />
                <span className=" text-primaryBlack text-xs mt-0.5">Invoice</span>
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DeliveryItem;