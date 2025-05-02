// API service for custom order-related operations
const API_URL = `${import.meta.env.VITE_API_URL}/custom-payment`;

export const fetchAllCustomOrders = async (params = {}) => {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);
    if (params.type) queryParams.append("type", params.type);
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `${API_URL}/all${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch custom orders");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching custom orders:", error);
    throw error;
  }
};

export const fetchCustomOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch custom order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching custom order:", error);
    throw error;
  }
};

export const updateCustomOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error("Failed to update custom order status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating custom order status:", error);
    throw error;
  }
};

export const deleteCustomOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to delete custom order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting custom order:", error);
    throw error;
  }
};
