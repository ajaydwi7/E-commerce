// API service for order-related operations
const API_URL = `${import.meta.env.VITE_API_URL}`;

export const fetchAllOrders = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${API_URL}/order/get-all-orders?page=${page}&limit=${limit}`,
      {
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const fetchOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/order/${orderId}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const fetchOrdersByUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/order/user/${userId}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user orders");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/order/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });
    if (!response.ok) {
      throw new Error("Failed to cancel order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await response.json().catch(() => ({})); // Handle empty responses

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
