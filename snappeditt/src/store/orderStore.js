import { useReducer } from "react";
import { toast } from "react-toastify";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const actions = {
  FETCH_ORDERS: "FETCH_ORDERS",
  PLACE_ORDER: "PLACE_ORDER",
  CANCEL_ORDER: "CANCEL_ORDER",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_CART_AFTER_ORDER: "CLEAR_CART_AFTER_ORDER",
  ADD_ORDER: "ADD_ORDER",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.FETCH_ORDERS:
      return {
        ...state,
        orders: action.orders,
        pagination: action.pagination, // Make sure this is passed
        loading: false,
      };
    case actions.PLACE_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.order],
        loading: false,
      };
    case actions.CANCEL_ORDER:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === action.orderId
            ? {
                ...order,
                ...action.updatedOrder,
                status: "Cancelled",
                order_cancelled: true,
                percentage_complete: 0,
              }
            : order
        ),
        loading: false,
      };
    case actions.CLEAR_CART_AFTER_ORDER:
      return { ...state, cart: [], cartTotal: 0, cartQuantity: 0 };
    case actions.SET_LOADING:
      return { ...state, loading: true };
    case actions.SET_ERROR:
      return { ...state, error: action.error, loading: false };
    case actions.ADD_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.order],
      };
    default:
      return state;
  }
};

const useOrderStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchOrders = async (userId, page = 1) => {
    dispatch({ type: actions.SET_LOADING });
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/order/user/${userId}?page=${page}&limit=5`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      dispatch({
        type: actions.FETCH_ORDERS,
        orders: data.orders,
        pagination: {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalOrders: data.total,
        },
      });
    } catch (error) {
      dispatch({ type: actions.SET_ERROR, error: error.message });
      toast.error("Error fetching orders: " + error.message);
    }
  };

  const placeOrder = async (orderData) => {
    dispatch({ type: actions.SET_LOADING });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/order/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...orderData,
            couponCode: orderData.couponCode || null,
            discount: orderData.discount || 0,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }
      dispatch({ type: actions.PLACE_ORDER, order: data.order });
      dispatch({ type: actions.CLEAR_CART_AFTER_ORDER }); // Reset cart state
      toast.success("Order placed successfully!");
    } catch (error) {
      dispatch({ type: actions.SET_ERROR, error: error.message });
      toast.error("Error placing order: " + error.message);
    }
  };
  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/order/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      const data = await response.json();

      dispatch({
        type: actions.CANCEL_ORDER,
        orderId,
        updatedOrder: data.order, // Add this
      });
      toast.success("Order cancelled successfully!");
      return data.order;
    } catch (error) {
      console.error("Error cancelling order:", error);
      dispatch({ type: actions.SET_ERROR, error: error.message });
      toast.error("Failed to cancel order: " + error.message);
    }
  };
  const addOrder = (order) => {
    dispatch({ type: actions.ADD_ORDER, order });
  };

  return {
    state,
    fetchOrders,
    placeOrder,
    cancelOrder,
    addOrder,
  };
};

export default useOrderStore;
