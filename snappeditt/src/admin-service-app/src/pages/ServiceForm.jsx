"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PlusIcon, TrashIcon } from "../components/Icons"

function ServiceForm() {
  const { categorySlug, subCategorySlug, serviceSlug } = useParams()
  const navigate = useNavigate()
  const isEditing = !!serviceSlug

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    basePrice: "",
    featureImage: "",
    features: [],
    variationTypes: [],
    priceCombinations: [],
  })

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories with subcategories
        const categoriesResponse = await fetch("/api/categories-with-subcategories")
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)

        // If editing, fetch the service data
        if (isEditing) {
          const serviceResponse = await fetch(`/api/admin/services/${categorySlug}/${subCategorySlug}/${serviceSlug}`)
          if (!serviceResponse.ok) {
            throw new Error("Failed to fetch service")
          }
          const serviceData = await serviceResponse.json()

          setFormData({
            name: serviceData.name || "",
            slug: serviceData.slug || "",
            description: serviceData.description || "",
            basePrice: serviceData.basePrice || "",
            featureImage: serviceData.featureImage || "",
            features: serviceData.features || [],
            variationTypes: serviceData.variationTypes || [],
            priceCombinations: serviceData.priceCombinations || [],
          })

          setSelectedCategory(categorySlug)
          setSelectedSubcategory(subCategorySlug)
        } else if (categorySlug && subCategorySlug) {
          // If creating a new service with pre-selected category and subcategory
          setSelectedCategory(categorySlug)
          setSelectedSubcategory(subCategorySlug)
        }

        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [categorySlug, subCategorySlug, serviceSlug, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from name if slug field is empty
    if (name === "name" && !formData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
      setFormData((prev) => ({ ...prev, slug: generatedSlug }))
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleCategoryChange = (e) => {
    const categorySlug = e.target.value
    setSelectedCategory(categorySlug)
    setSelectedSubcategory("")
  }

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value)
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, { name: newFeature, included: true }],
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const handleFeatureIncludedChange = (index, included) => {
    setFormData((prev) => {
      const updatedFeatures = [...prev.features]
      updatedFeatures[index] = { ...updatedFeatures[index], included }
      return { ...prev, features: updatedFeatures }
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required"
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens"
    }

    if (!formData.basePrice) {
      newErrors.basePrice = "Base price is required"
    } else if (isNaN(formData.basePrice) || Number(formData.basePrice) <= 0) {
      newErrors.basePrice = "Base price must be a positive number"
    }

    if (!selectedCategory) {
      newErrors.category = "Category is required"
    }

    if (!selectedSubcategory) {
      newErrors.subcategory = "Subcategory is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const url = isEditing
        ? `/api/categories/${selectedCategory}/subcategories/${selectedSubcategory}/services/${serviceSlug}`
        : `/api/categories/${selectedCategory}/subcategories/${selectedSubcategory}/services`

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          basePrice: Number(formData.basePrice),
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} service`)
      }

      alert(`Service ${isEditing ? "updated" : "created"} successfully`)
      navigate("/services")
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? "Edit Service" : "Add New Service"}</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Service Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={`form-input ${errors.slug ? "border-red-500" : ""}`}
            />
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
            <p className="mt-1 text-xs text-gray-500">Used in URLs. Only lowercase letters, numbers, and hyphens.</p>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Base Price *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                id="basePrice"
                name="basePrice"
                min="0"
                step="0.01"
                value={formData.basePrice}
                onChange={handleChange}
                className={`form-input pl-7 ${errors.basePrice ? "border-red-500" : ""}`}
              />
            </div>
            {errors.basePrice && <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className={`form-input ${errors.category ? "border-red-500" : ""}`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory *
            </label>
            <select
              id="subcategory"
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
              disabled={!selectedCategory}
              className={`form-input ${errors.subcategory ? "border-red-500" : ""}`}
            >
              <option value="">Select a subcategory</option>
              {selectedCategory &&
                categories
                  .find((cat) => cat.slug === selectedCategory)
                  ?.subCategories.map((subcategory) => (
                    <option key={subcategory.slug} value={subcategory.slug}>
                      {subcategory.name}
                    </option>
                  ))}
            </select>
            {errors.subcategory && <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="featureImage" className="block text-sm font-medium text-gray-700 mb-1">
            Feature Image URL
          </label>
          <input
            type="text"
            id="featureImage"
            name="featureImage"
            value={formData.featureImage}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/image.jpg"
          />
          {formData.featureImage && (
            <div className="mt-2">
              <img
                src={formData.featureImage || "/placeholder.svg"}
                alt="Feature preview"
                className="h-32 w-auto object-cover rounded-md"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "https://via.placeholder.com/300x200?text=Invalid+Image+URL"
                }}
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="form-input flex-1 mr-2"
              placeholder="Add a feature"
            />
            <button type="button" onClick={handleAddFeature} className="btn btn-secondary">
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          {formData.features.length > 0 ? (
            <ul className="space-y-2 mt-3">
              {formData.features.map((feature, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={feature.included}
                      onChange={(e) => handleFeatureIncludedChange(index, e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className={`ml-2 ${!feature.included ? "line-through text-gray-400" : ""}`}>
                      {feature.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No features added yet.</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/services")}
            className="btn btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : isEditing ? "Update Service" : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ServiceForm

