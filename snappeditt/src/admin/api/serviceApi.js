// API service for service-related operations
const API_URL = `${import.meta.env.VITE_API_URL}/services`;

// Fetch all services
export const fetchAllServices = async () => {
  try {
    const response = await fetch(`${API_URL}/get-services`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Fetch all categories with subcategories
export const fetchCategoriesWithSubcategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories-with-subcategories`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Fetch a service by slugs
export const fetchServiceBySlugs = async (
  categorySlug,
  subCategorySlug,
  serviceSlug
) => {
  try {
    const response = await fetch(
      `${API_URL}/admin/services/${categorySlug}/${subCategorySlug}/${serviceSlug}`,
      {
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch service");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error;
  }
};

// Create a new service
export const createService = async (
  categorySlug,
  subCategorySlug,
  serviceData
) => {
  try {
    // Use the correct API URL format for creating services
    const response = await fetch(
      `${API_URL}/categories/${categorySlug}/${subCategorySlug}/services`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(serviceData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create service");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

// Update a service
export const updateService = async (
  categorySlug,
  subCategorySlug,
  serviceSlug,
  serviceData
) => {
  try {
    // Use the correct API URL format for updating services
    const response = await fetch(
      `${API_URL}/categories/${categorySlug}/${subCategorySlug}/services/${serviceSlug}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(serviceData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update service");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

// Add this new upload function
export const uploadServiceImages = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/upload-images`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};
// Delete a service
export const deleteService = async (
  categorySlug,
  subCategorySlug,
  serviceSlug
) => {
  try {
    // Use the correct API URL format for deleting services
    const response = await fetch(
      `${API_URL}/categories/${categorySlug}/${subCategorySlug}/services/${serviceSlug}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete service");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      throw new Error("Failed to create category");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Create a new subcategory
export const createSubcategory = async (categorySlug, subcategoryData) => {
  try {
    const response = await fetch(
      `${API_URL}/categories/${categorySlug}/subcategories`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(subcategoryData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create subcategory");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating subcategory:", error);
    throw error;
  }
};
