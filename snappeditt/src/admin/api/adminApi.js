// API service for admin-related operations
const API_URL = `${import.meta.env.VITE_API_URL}/admin`;

// Admin Authentication
export const loginAdmin = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/check-auth`, {
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error("Auth check error:", error);
    throw error;
  }
};

// Admin Profile
export const getAdminProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Profile fetch error:", error);
    throw error;
  }
};

export const updateAdminProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Update failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Profile update error:", error);
    throw error;
  }
};

export const changeAdminPassword = async (passwordData) => {
  try {
    const response = await fetch(`${API_URL}/profile/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Password change failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
};

// Admin Management (Super Admin only)
export const getAllAdmins = async (page = 1, limit = 10, search = "") => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
    });

    if (search) {
      queryParams.append("search", search);
    }

    const response = await fetch(
      `${API_URL}/admins?${queryParams.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch admins");
    }

    return await response.json();
  } catch (error) {
    console.error("Admins fetch error:", error);
    throw error;
  }
};

export const createAdmin = async (adminData) => {
  try {
    const response = await fetch(`${API_URL}/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(adminData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create admin");
    }

    return await response.json();
  } catch (error) {
    console.error("Admin creation error:", error);
    throw error;
  }
};

export const updateAdmin = async (adminId, adminData) => {
  try {
    const response = await fetch(`${API_URL}/admins/${adminId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(adminData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update admin");
    }

    return await response.json();
  } catch (error) {
    console.error("Admin update error:", error);
    throw error;
  }
};

export const deleteAdmin = async (adminId) => {
  try {
    const response = await fetch(`${API_URL}/admins/${adminId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete admin");
    }

    return await response.json();
  } catch (error) {
    console.error("Admin deletion error:", error);
    throw error;
  }
};

// Notification API
export const getNotifications = async () => {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return await response.json();
  } catch (error) {
    console.error("Notifications fetch error:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch(
      `${API_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    return await response.json();
  } catch (error) {
    console.error("Notification update error:", error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PATCH",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }

    return await response.json();
  } catch (error) {
    console.error("Notifications update error:", error);
    throw error;
  }
};

export const forgotAdminPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to process forgot password request"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

export const resetAdminPassword = async (token, password) => {
  try {
    const response = await fetch(`${API_URL}/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to reset password");
    }

    return await response.json();
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};
