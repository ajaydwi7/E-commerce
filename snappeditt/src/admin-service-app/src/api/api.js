// This file contains functions to interact with the backend API

// Fetch all services
export const fetchServices = async () => {
  const response = await fetch("/api/get-services")
  if (!response.ok) {
    throw new Error("Failed to fetch services")
  }
  return response.json()
}

// Fetch all categories with subcategories
export const fetchCategoriesWithSubcategories = async () => {
  const response = await fetch("/api/categories-with-subcategories")
  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }
  return response.json()
}

// Add a new category
export const addCategory = async (categoryData) => {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  })

  if (!response.ok) {
    throw new Error("Failed to add category")
  }

  return response.json()
}

// Update a category
export const updateCategory = async (categorySlug, categoryData) => {
  const response = await fetch(`/api/categories/${categorySlug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  })

  if (!response.ok) {
    throw new Error("Failed to update category")
  }

  return response.json()
}

// Delete a category
export const deleteCategory = async (categorySlug) => {
  const response = await fetch(`/api/categories/${categorySlug}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete category")
  }

  return response.json()
}

// Add a subcategory to a category
export const addSubcategory = async (categorySlug, subcategoryData) => {
  const response = await fetch(`/api/categories/${categorySlug}/subcategories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subcategoryData),
  })

  if (!response.ok) {
    throw new Error("Failed to add subcategory")
  }

  return response.json()
}

// Update a subcategory
export const updateSubcategory = async (categorySlug, subcategorySlug, subcategoryData) => {
  const response = await fetch(`/api/categories/${categorySlug}/subcategories/${subcategorySlug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subcategoryData),
  })

  if (!response.ok) {
    throw new Error("Failed to update subcategory")
  }

  return response.json()
}

// Delete a subcategory
export const deleteSubcategory = async (categorySlug, subcategorySlug) => {
  const response = await fetch(`/api/categories/${categorySlug}/subcategories/${subcategorySlug}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete subcategory")
  }

  return response.json()
}

// Add a service to a subcategory
export const addService = async (categorySlug, subcategorySlug, serviceData) => {
  const response = await fetch(`/api/categories/${categorySlug}/subcategories/${subcategorySlug}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  })

  if (!response.ok) {
    throw new Error("Failed to add service")
  }

  return response.json()
}

// Update a service
export const updateService = async (categorySlug, subcategorySlug, serviceSlug, serviceData) => {
  const response = await fetch(
    `/api/categories/${categorySlug}/subcategories/${subcategorySlug}/services/${serviceSlug}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    },
  )

  if (!response.ok) {
    throw new Error("Failed to update service")
  }

  return response.json()
}

// Delete a service
export const deleteService = async (categorySlug, subcategorySlug, serviceSlug) => {
  const response = await fetch(
    `/api/categories/${categorySlug}/subcategories/${subcategorySlug}/services/${serviceSlug}`,
    {
      method: "DELETE",
    },
  )

  if (!response.ok) {
    throw new Error("Failed to delete service")
  }

  return response.json()
}

// Get a service by slugs
export const getServiceBySlugs = async (categorySlug, subcategorySlug, serviceSlug) => {
  const response = await fetch(`/api/admin/services/${categorySlug}/${subcategorySlug}/${serviceSlug}`)

  if (!response.ok) {
    throw new Error("Failed to fetch service")
  }

  return response.json()
}

