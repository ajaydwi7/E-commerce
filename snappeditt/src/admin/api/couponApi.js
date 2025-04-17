// API service for coupon-related operations
const API_URL = `${import.meta.env.VITE_API_URL}/coupons`;

export const fetchAllCoupons = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      credentials: "include",
    });

    if (response.status === 401) {
      // Handle unauthorized access
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch coupons");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

export const createCoupon = async (couponData) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(couponData),
    });
    if (!response.ok) {
      throw new Error("Failed to create coupon");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

export const updateCoupon = async (couponId, couponData) => {
  try {
    const response = await fetch(`${API_URL}/${couponId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(couponData),
    });
    if (!response.ok) {
      throw new Error("Failed to update coupon");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

export const validateCoupon = async (code, cartTotal) => {
  try {
    const response = await fetch(`${API_URL}/validate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, cartTotal }),
    });
    if (!response.ok) {
      throw new Error("Failed to validate coupon");
    }
    return await response.json();
  } catch (error) {
    console.error("Error validating coupon:", error);
    throw error;
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    const response = await fetch(`${API_URL}/${couponId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to delete coupon");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};
