// API service for contact form-related operations
const API_URL = `${import.meta.env.VITE_API_URL}/admin/contact`;

export const getAllContactForms = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 10,
    });

    if (filters.status) {
      queryParams.append("status", filters.status);
    }

    if (filters.dateRange) {
      queryParams.append("dateRange", filters.dateRange);
    }

    if (filters.search) {
      queryParams.append("search", filters.search);
    }

    const response = await fetch(`${API_URL}/forms?${queryParams.toString()}`, {
      credentials: "include",
    });

    if (response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch contact forms");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching contact forms:", error);
    throw error;
  }
};

export const getContactFormById = async (formId) => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch contact form details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching contact form details:", error);
    throw error;
  }
};

export const updateContactFormStatus = async (formId, status) => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}/status`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update contact form status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating contact form status:", error);
    throw error;
  }
};

export const deleteContactForm = async (formId) => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete contact form");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting contact form:", error);
    throw error;
  }
};

export const addNoteToContactForm = async (formId, note) => {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}/notes`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note }),
    });

    if (!response.ok) {
      throw new Error("Failed to add note to contact form");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding note to contact form:", error);
    throw error;
  }
};
