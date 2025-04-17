// API service for free trial-related operations
const API_URL = `${import.meta.env.VITE_API_URL}/admin/free-trial`;

export const getAllFreeTrials = async (filters = {}) => {
  try {
    let queryString = "";
    if (Object.keys(filters).length > 0) {
      queryString = "?" + new URLSearchParams(filters).toString();
    }

    const response = await fetch(`${API_URL}${queryString}`, {
      credentials: "include",
    });

    if (response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch free trials");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching free trials:", error);
    throw error;
  }
};

export const getFreeTrialById = async (trialId) => {
  try {
    const response = await fetch(`${API_URL}/${trialId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch free trial details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching free trial details:", error);
    throw error;
  }
};

export const updateFreeTrialStatus = async (trialId, status) => {
  try {
    const response = await fetch(`${API_URL}/${trialId}/status`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update free trial status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating free trial status:", error);
    throw error;
  }
};

export const deleteFreeTrial = async (trialId) => {
  try {
    const response = await fetch(`${API_URL}/${trialId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete free trial");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting free trial:", error);
    throw error;
  }
};

export const addNoteToFreeTrial = async (trialId, note) => {
  try {
    const response = await fetch(`${API_URL}/${trialId}/notes`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note }),
    });

    if (!response.ok) {
      throw new Error("Failed to add note to free trial");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding note to free trial:", error);
    throw error;
  }
};
