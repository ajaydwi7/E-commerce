// API service for user-related operations
const API_URL = `${import.meta.env.VITE_API_URL}`;

export const fetchAllUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.search && { search: params.search }),
    }).toString();

    const response = await fetch(`${API_URL}/admin/users?${queryParams}`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch user");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
