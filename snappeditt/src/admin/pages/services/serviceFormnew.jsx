"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PlusIcon, TrashIcon } from "../components/Icons"
import * as serviceApi from "../api/serviceApi"

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
    basePrice: 0,
    featureImage: "",
    features: [],
    images: [],
    variationTypes: [],
    priceCombinations: [],
  })

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [errors, setErrors] = useState({})

  // New category/subcategory state
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" })
  const [showNewSubcategory, setShowNewSubcategory] = useState(false)
  const [newSubcategory, setNewSubcategory] = useState({ name: "", slug: "" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories with subcategories
        const categoriesData = await serviceApi.fetchCategoriesWithSubcategories()
        setCategories(categoriesData)

        // If editing, fetch the service data
        if (isEditing) {
          const serviceData = await serviceApi.fetchServiceBySlugs(categorySlug, subCategorySlug, serviceSlug)

          setFormData({
            name: serviceData.name || "",
            slug: serviceData.slug || "",
            description: serviceData.description || "",
            basePrice: serviceData.basePrice || 0,
            featureImage: serviceData.featureImage || "",
            features: serviceData.features || [],
            images: serviceData.images || [],
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
        console.error("Error fetching data:", err)
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

  // Array handling functions
  const handleArrayUpdate = (field, index, key, value) => {
    const updatedArray = [...formData[field]]
    updatedArray[index] = { ...updatedArray[index], [key]: value }
    setFormData({ ...formData, [field]: updatedArray })
  }

  const addArrayItem = (field, template) => {
    setFormData({ ...formData, [field]: [...formData[field], template] })
  }

  const removeArrayItem = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: updatedArray })
  }

  // Feature handling
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
    removeArrayItem("features", index)
  }

  const handleFeatureIncludedChange = (index, included) => {
    handleArrayUpdate("features", index, "included", included)
  }

  // Category/Subcategory creation
  const handleCreateCategory = async () => {
    try {
      if (!newCategory.name || !newCategory.slug) {
        alert("Category name and slug are required")
        return
      }

      await serviceApi.createCategory(newCategory)
      const updatedCategories = await serviceApi.fetchCategoriesWithSubcategories()
      setCategories(updatedCategories)
      setShowNewCategory(false)
      setNewCategory({ name: "", slug: "" })

      // Set the newly created category as selected
      setSelectedCategory(newCategory.slug)
    } catch (error) {
      console.error("Error creating category:", error)
      setError(error.message)
    }
  }

  const handleCreateSubcategory = async () => {
    try {
      if (!selectedCategory) {
        alert("Please select a category first")
        return
      }

      if (!newSubcategory.name || !newSubcategory.slug) {
        alert("Subcategory name and slug are required")
        return
      }

      await serviceApi.createSubcategory(selectedCategory, newSubcategory)
      const updatedCategories = await serviceApi.fetchCategoriesWithSubcategories()
      setCategories(updatedCategories)
      setShowNewSubcategory(false)
      setNewSubcategory({ name: "", slug: "" })

      // Set the newly created subcategory as selected
      setSelectedSubcategory(newSubcategory.slug)
    } catch (error) {
      console.error("Error creating subcategory:", error)
      setError(error.message)
    }
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
      // Prepare the data for submission
      const serviceData = {
        ...formData,
        basePrice: Number(formData.basePrice),
        category: selectedCategory,
        subcategory: selectedSubcategory,
      }

      if (isEditing) {
        await serviceApi.updateService(selectedCategory, selectedSubcategory, serviceSlug, serviceData)
      } else {
        await serviceApi.createService(selectedCategory, selectedSubcategory, serviceData)
      }

      alert(`Service ${isEditing ? "updated" : "created"} successfully`)
      navigate("/admin/services")
    } catch (err) {
      console.error("Error submitting form:", err)
      setError(err.message)
    } finally {
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
    <div className="p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Management */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Category Management</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  disabled={isEditing}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                <button type="button" onClick={() => setShowNewCategory(true)} className="text-blue-500 text-sm">
                  + Create New Category
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subcategory *</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  disabled={!selectedCategory || isEditing}
                >
                  <option value="">Select Subcategory</option>
                  {selectedCategory &&
                    categories
                      .find((c) => c.slug === selectedCategory)
                      ?.subCategories.map((sub) => (
                        <option key={sub._id} value={sub.slug}>
                          {sub.name}
                        </option>
                      ))}
                </select>
                {errors.subcategory && <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>}
                <button
                  type="button"
                  onClick={() => setShowNewSubcategory(true)}
                  className="text-blue-500 text-sm"
                  disabled={!selectedCategory}
                >
                  + Create New Subcategory
                </button>
              </div>
            </div>

            {/* New Category Form */}
            {showNewCategory && (
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium mb-2">Create New Category</h4>
                <input
                  type="text"
                  placeholder="Category Name"
                  className="w-full p-2 border rounded-md mb-2"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Category Slug"
                  className="w-full p-2 border rounded-md mb-2"
                  value={newCategory.slug}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* New Subcategory Form */}
            {showNewSubcategory && (
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium mb-2">Create New Subcategory</h4>
                <input
                  type="text"
                  placeholder="Subcategory Name"
                  className="w-full p-2 border rounded-md mb-2"
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Subcategory Slug"
                  className="w-full p-2 border rounded-md mb-2"
                  value={newSubcategory.slug}
                  onChange={(e) =>
                    setNewSubcategory({
                      ...newSubcategory,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateSubcategory}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewSubcategory(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Service Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.slug ? "border-red-500" : ""}`}
              />
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
              <p className="mt-1 text-xs text-gray-500">Used in URLs. Only lowercase letters, numbers, and hyphens.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
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
                  required
                  value={formData.basePrice}
                  onChange={handleChange}
                  className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 pl-7 ${errors.basePrice ? "border-red-500" : ""}`}
                />
              </div>
              {errors.basePrice && <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="featureImage" className="block text-sm font-medium text-gray-700">
                Feature Image URL
              </label>
              <input
                type="url"
                id="featureImage"
                name="featureImage"
                value={formData.featureImage}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Features</h3>
              <button
                type="button"
                onClick={() => addArrayItem("features", { name: "", included: true })}
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
              >
                Add Feature
              </button>
            </div>

            <div className="flex mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1 mr-2"
                placeholder="Add a feature"
              />
              <button type="button" onClick={handleAddFeature} className="px-3 py-1 bg-blue-500 text-white rounded-md">
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

          {/* Images */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Before/After Images</h3>
              <button
                type="button"
                onClick={() => addArrayItem("images", { before: "", after: "" })}
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
              >
                Add Image Pair
              </button>
            </div>

            {formData.images.map((image, imgIndex) => (
              <div key={imgIndex} className="border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Image Pair #{imgIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem("images", imgIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Before Image URL</label>
                    <input
                      type="url"
                      className="w-full p-2 border rounded-md"
                      value={image.before}
                      onChange={(e) => handleArrayUpdate("images", imgIndex, "before", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">After Image URL</label>
                    <input
                      type="url"
                      className="w-full p-2 border rounded-md"
                      value={image.after}
                      onChange={(e) => handleArrayUpdate("images", imgIndex, "after", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Variation Types */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Variation Types</h3>
              <button
                type="button"
                onClick={() => addArrayItem("variationTypes", { name: "", options: [], required: false })}
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
              >
                Add Variation Type
              </button>
            </div>

            {formData.variationTypes.map((vt, vtIndex) => (
              <div key={vtIndex} className="border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Variation Type #{vtIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem("variationTypes", vtIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        type="text"
                        required
                        className="w-full p-2 border rounded-md"
                        value={vt.name}
                        onChange={(e) => handleArrayUpdate("variationTypes", vtIndex, "name", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="block text-sm font-medium">Required</label>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={vt.required}
                        onChange={(e) => handleArrayUpdate("variationTypes", vtIndex, "required", e.target.checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium">Options</h5>
                      <button
                        type="button"
                        onClick={() =>
                          handleArrayUpdate("variationTypes", vtIndex, "options", [
                            ...vt.options,
                            { name: "", description: "" },
                          ])
                        }
                        className="px-2 py-1 bg-gray-200 rounded text-sm"
                      >
                        Add Option
                      </button>
                    </div>

                    {vt.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Option name"
                          className="flex-1 p-2 border rounded-md"
                          value={option.name}
                          onChange={(e) => {
                            const newOptions = [...vt.options]
                            newOptions[optIndex].name = e.target.value
                            handleArrayUpdate("variationTypes", vtIndex, "options", newOptions)
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          className="flex-1 p-2 border rounded-md"
                          value={option.description}
                          onChange={(e) => {
                            const newOptions = [...vt.options]
                            newOptions[optIndex].description = e.target.value
                            handleArrayUpdate("variationTypes", vtIndex, "options", newOptions)
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = vt.options.filter((_, i) => i !== optIndex)
                            handleArrayUpdate("variationTypes", vtIndex, "options", newOptions)
                          }}
                          className="text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Combinations */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Price Combinations</h3>
              <button
                type="button"
                onClick={() => addArrayItem("priceCombinations", { combination: [], price: 0 })}
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
              >
                Add Price Combination
              </button>
            </div>

            {formData.priceCombinations.map((pc, pcIndex) => (
              <div key={pcIndex} className="border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Combination #{pcIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem("priceCombinations", pcIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Options Combination</label>
                    <select
                      multiple
                      className="w-full p-2 border rounded-md h-32"
                      value={pc.combination}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value)
                        handleArrayUpdate("priceCombinations", pcIndex, "combination", selected)
                      }}
                    >
                      {formData.variationTypes.flatMap((vt) =>
                        vt.options.map((opt) => (
                          <option key={opt.name} value={opt.name}>
                            {vt.name}: {opt.name}
                          </option>
                        )),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Price</label>
                    <input
                      type="number"
                      required
                      className="w-full p-2 border rounded-md"
                      value={pc.price}
                      onChange={(e) => handleArrayUpdate("priceCombinations", pcIndex, "price", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/services")}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={submitting}
            >
              {submitting ? "Saving..." : isEditing ? "Update Service" : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ServiceForm