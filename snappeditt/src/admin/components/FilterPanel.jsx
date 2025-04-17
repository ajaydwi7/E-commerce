"use client"

import { useState } from "react"
import { FilterIcon, ChevronDownIcon } from "./Icons"

function FilterPanel({ categories, selectedFilters, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  const handleCategoryChange = (categorySlug) => {
    const newFilters = { ...selectedFilters }

    if (newFilters.categories.includes(categorySlug)) {
      newFilters.categories = newFilters.categories.filter((slug) => slug !== categorySlug)
      // Remove subcategories of this category
      const category = categories.find((cat) => cat.slug === categorySlug)
      if (category) {
        const subCategorySlugs = category.subCategories.map((sub) => sub.slug)
        newFilters.subcategories = newFilters.subcategories.filter((slug) => !subCategorySlugs.includes(slug))
      }
    } else {
      newFilters.categories = [...newFilters.categories, categorySlug]
    }

    onFilterChange(newFilters)
  }

  const handleSubcategoryChange = (subcategorySlug) => {
    const newFilters = { ...selectedFilters }

    if (newFilters.subcategories.includes(subcategorySlug)) {
      newFilters.subcategories = newFilters.subcategories.filter((slug) => slug !== subcategorySlug)
    } else {
      newFilters.subcategories = [...newFilters.subcategories, subcategorySlug]
    }

    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="p-4 flex justify-between items-center cursor-pointer" onClick={togglePanel}>
        <div className="flex items-center">
          <FilterIcon className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.slug} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.slug}`}
                      checked={selectedFilters.categories.includes(category.slug)}
                      onChange={() => handleCategoryChange(category.slug)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`category-${category.slug}`} className="ml-2 text-sm text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Subcategories</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories
                  .filter(
                    (category) =>
                      selectedFilters.categories.length === 0 || selectedFilters.categories.includes(category.slug),
                  )
                  .flatMap((category) => category.subCategories)
                  .map((subcategory) => (
                    <div key={subcategory.slug} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`subcategory-${subcategory.slug}`}
                        checked={selectedFilters.subcategories.includes(subcategory.slug)}
                        onChange={() => handleSubcategoryChange(subcategory.slug)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`subcategory-${subcategory.slug}`} className="ml-2 text-sm text-gray-700">
                        {subcategory.name}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => onFilterChange({ categories: [], subcategories: [] })}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel

