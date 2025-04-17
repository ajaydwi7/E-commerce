import React, { useEffect, useState } from "react";
import SEO from "@/components/SEO/SEO";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import DeliveryEmpty from "@/components/Delivery/DeliveryEmpty/DeliveryEmpty";
import DeliveryItem from "@/components/Delivery/DeliveryItem/DeliveryItem";
import Pagination from "@/components/GlobalComponents/Pagination/Pagination";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";

const DeliveryView = () => {
  const { orders, auth, modal } = useGlobalContext();
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (auth.state.user) {
        // Add currentPage to fetchOrders call
        await orders.fetchOrders(auth.state.user.id, currentPage);
        setLoadingOrders(false);
      } else {
        modal.openModal(false);
        setLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, [auth.state.user, currentPage]); // Depend on the user object

  const reloadOrders = async () => {
    setDisabled(true);
    setCurrentPage(1); // Reset to first page
    toast.info("Reloading orders...");
    await orders.fetchOrders(auth.state.user.id, 1);
    setDisabled(false);
    toast.success("Orders reloaded!");
  };

  return (
    <div>
      <SEO
        title="order || snappeditt"
        noindex={true}
      />

      {/* Check if user is logged in */}
      {auth.state.user == null ? (
        <DeliveryEmpty />
      ) : (
        <div>
          {/* Reload Orders Button */}
          <div className="reload-orders">
            <button
              className="btn-rounded"
              onClick={reloadOrders}
              disabled={disabled}
            >
              Reload Orders
            </button>
          </div>

          {/* Show orders if available */}
          {loadingOrders ? (
            <Skeleton height={500} />
          ) :
            orders.state.orders.length > 0 ? (
              orders.state.orders.map((order) => (
                <DeliveryItem key={order._id} order={order} />
              ))
            ) : (
              <p>No orders found</p>
            )}
        </div>
      )}
      {orders.state.orders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={orders.state.pagination?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default DeliveryView;