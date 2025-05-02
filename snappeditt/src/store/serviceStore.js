import { useReducer, useEffect } from "react";
import { toast } from "react-toastify";

const initialState = {
  cart: [],
  cartTotal: 0,
  cartQuantity: 0,
  loading: true,
};

const actions = {
  LOAD_CART: "LOAD_CART",
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  CLEAR_CART: "CLEAR_CART",
  SET_LOADING: "SET_LOADING",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.LOAD_CART:
      return { ...state, ...action.payload, loading: false };
    case actions.ADD_TO_CART:
      return {
        ...state,
        cart: action.payload.cart,
        cartTotal: action.payload.cartTotal,
        cartQuantity: action.payload.cartQuantity,
        loading: false,
      };
    case actions.REMOVE_FROM_CART:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case actions.CLEAR_CART:
      return { ...initialState, loading: false };
    case actions.SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const useServiceStore = (auth) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchCart = async () => {
    if (!auth.state.user?.id) return;

    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        credentials: "include",
      });

      if (response.status === 404) {
        return dispatch({ type: actions.LOAD_CART, payload: initialState });
      }

      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();
      dispatch({
        type: actions.LOAD_CART,
        payload: {
          cart: data.items || [],
          cartTotal: data.cartTotal,
          cartQuantity: data.cartQuantity,
        },
      });
    } catch (error) {
      toast.error("Failed to load cart");
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  const addToCart = async (item) => {
    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ item }), // Remove userId
      });

      if (!response.ok) throw new Error("Failed to add item to cart");

      const data = await response.json();
      dispatch({
        type: actions.ADD_TO_CART,
        payload: {
          cart: data.items,
          cartTotal: data.cartTotal,
          cartQuantity: data.cartQuantity,
        },
      });
      toast.success(`${item.serviceName} added to cart!`);
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  const updateCartQuantity = async (
    serviceId,
    quantity,
    selectedVariations
  ) => {
    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cart/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ serviceId, quantity, selectedVariations }), // Include variations
        }
      );

      if (!response.ok) throw new Error("Failed to update quantity");
      const data = await response.json();
      toast.success("Cart updated successfully!");
      dispatch({
        type: actions.ADD_TO_CART,
        payload: {
          cart: data.items,
          cartTotal: data.cartTotal,
          cartQuantity: data.cartQuantity,
        },
      });
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  const removeFromCart = async (serviceId) => {
    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cart/remove`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ serviceId }),
        }
      );

      if (!response.ok) throw new Error("Failed to remove item");

      const data = await response.json();
      dispatch({
        type: actions.REMOVE_FROM_CART,
        payload: {
          cart: data.items,
          cartTotal: data.cartTotal,
          cartQuantity: data.cartQuantity,
        },
      });
      toast.success("Item removed");
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  const clearCart = async () => {
    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/cart/clear`, {
        method: "DELETE",
        credentials: "include",
      });
      dispatch({ type: actions.CLEAR_CART });
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    fetchCart();
  }, [auth.state.user]);

  return {
    state,
    fetchCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  };
};

export default useServiceStore;
