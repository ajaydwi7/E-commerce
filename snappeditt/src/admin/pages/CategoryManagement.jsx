"use client"

import { useState, useEffect } from "react"
import CategoryForm from "../components/CategoryForm"
import SubcategoryForm from "../components/SubcategoryForm"
import { PencilIcon, TrashIcon, PlusIcon, ChevronDownIcon } from "../components/Icons"

function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [showSubcategoryForm, setShowSubcategoryForm] = useState({})
  const [editingSubcategory, setEditingSubcategory] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({})

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/categories-with-subcategories`)
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data = await response.json()
      setCategories(data)

      // Initialize expanded state for all categories
      const expanded = {}
      data.forEach((category) => {
        expanded[category.slug] = true // Start with all expanded
      })
      setExpandedCategories(expanded)

      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleAddCategory = async (categoryData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        throw new Error("Failed to add category")
      }

      const newCategory = await response.json()
      setCategories([...categories, newCategory])
      setShowCategoryForm(false)

      alert("Category added successfully")
    } catch (err) {
      alert(`Error adding category: ${err.message}`)
    }
  }

  const handleUpdateCategory = async (categoryData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/categories/${editingCategory.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        throw new Error("Failed to update category")
      }

      const updatedCategory = await response.json()

      setCategories(categories.map((cat) => (cat.slug === editingCategory.slug ? updatedCategory : cat)))

      setEditingCategory(null)

      alert("Category updated successfully")
    } catch (err) {
      alert(`Error updating category: ${err.message}`)
    }
  }

  const handleDeleteCategory = async (category) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${category.name}? This will also delete all subcategories and services within this category.`,
      )
    ) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/services/categories/${category.slug}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete category")
        }

        setCategories(categories.filter((cat) => cat.slug !== category.slug))

        alert("Category deleted successfully")
      } catch (err) {
        alert(`Error deleting category: ${err.message}`)
      }
    }
  }

  const handleAddSubcategory = async (subcategoryData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/categories/${subcategoryData.categorySlug}/subcategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: subcategoryData.name,
          slug: subcategoryData.slug,
          description: subcategoryData.description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add subcategory")
      }

      const updatedCategory = await response.json()

      setCategories(categories.map((cat) => (cat.slug === subcategoryData.categorySlug ? updatedCategory : cat)))

      setShowSubcategoryForm({})

      alert("Subcategory added successfully")
    } catch (err) {
      alert(`Error adding subcategory: ${err.message}`)
    }
  }

  const handleUpdateSubcategory = async (subcategoryData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/categories/${subcategoryData.categorySlug}/subcategories/${editingSubcategory.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: subcategoryData.name,
            slug: subcategoryData.slug,
            description: subcategoryData.description,
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update subcategory")
      }

      const updatedCategory = await response.json()

      setCategories(categories.map((cat) => (cat.slug === subcategoryData.categorySlug ? updatedCategory : cat)))

      setEditingSubcategory(null)

      alert("Subcategory updated successfully")
    } catch (err) {
      alert(`Error updating subcategory: ${err.message}`)
    }
  }

  const handleDeleteSubcategory = async (category, subcategory) => {
    if (window.confirm(`Delete ${subcategory.name}?`)) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/services/categories/${category.slug}/subcategories/${subcategory.slug}`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          throw new Error("Failed to delete subcategory")
        }

        // Update the categories state
        setCategories(
          categories.map((cat) => {
            if (cat.slug === category.slug) {
              return {
                ...cat,
                subCategories: cat.subCategories.filter((sub) => sub.slug !== subcategory.slug),
              }
            }
            return cat
          }),
        )

        alert("Subcategory deleted successfully")
      } catch (err) {
        alert(`Error deleting subcategory: ${err.message}`)
      }
    }
  }

  const toggleCategoryExpand = (categorySlug) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categorySlug]: !prev[categorySlug],
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
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
            <p className="text-sm text-red-700">Error loading categories: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Category Management</h1>
        <button
          type="button"
          onClick={() => {
            setEditingCategory(null)
            setShowCategoryForm(!showCategoryForm)
          }}
          className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Category
        </button>
      </div>

      {showCategoryForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <CategoryForm
            onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
            initialData={editingCategory}
          />
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No categories found. Create your first category to get started.</p>
          <button type="button" onClick={() => setShowCategoryForm(true)} className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500">
            Add New Category
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => toggleCategoryExpand(category.slug)}
                      className="mr-2 text-gray-500 hover:text-gray-700"
                    >
                      <ChevronDownIcon
                        className={`h-5 w-5 transform transition-transform ${expandedCategories[category.slug] ? "rotate-180" : ""}`}
                      />
                    </button>
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                    <span className="ml-2 text-sm text-gray-500">({category.subCategories.length} subcategories)</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(category)
                        setShowCategoryForm(true)
                      }}
                      className="p-1 text-gray-500 hover:text-indigo-600"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {category.description && <p className="mt-1 text-sm text-gray-600">{category.description}</p>}
              </div>

              {expandedCategories[category.slug] && (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-700">Subcategories</h4>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSubcategory(null)
                        setShowSubcategoryForm((prev) => ({
                          ...prev,
                          [category.slug]: !prev[category.slug],
                        }))
                      }}
                      className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Subcategory
                    </button>
                  </div>

                  {showSubcategoryForm[category.slug] && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        {editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}
                      </h5>
                      <SubcategoryForm
                        onSubmit={editingSubcategory ? handleUpdateSubcategory : handleAddSubcategory}
                        categorySlug={category.slug}
                        initialData={editingSubcategory}
                      />
                    </div>
                  )}

                  {category.subCategories.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No subcategories found.</p>
                  ) : (
                    <div className="space-y-3">
                      {category.subCategories.map((subcategory) => (
                        <div key={subcategory.slug} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-800">{subcategory.name}</h5>
                              {subcategory.description && (
                                <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>
                              )}
                              <div className="mt-1">
                                <span className="text-xs text-gray-500">
                                  {subcategory.services?.length || 0} services
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSubcategory(subcategory)
                                  setShowSubcategoryForm((prev) => ({
                                    ...prev,
                                    [category.slug]: true,
                                  }))
                                }}
                                className="p-1 text-gray-500 hover:text-indigo-600"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSubcategory(category, subcategory)}
                                className="p-1 text-gray-500 hover:text-red-600"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryManagement

