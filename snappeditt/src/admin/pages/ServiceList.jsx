"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ServiceCard from "../components/ServiceCard"
import FilterPanel from "../components/FilterPanel"
import { PlusIcon, SearchIcon } from "../components/Icons"
import * as serviceApi from "../api/serviceApi"

function ServiceList() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Use serviceApi for fetching data
        const [servicesData, categoriesData] = await Promise.all([
          serviceApi.fetchAllServices(),
          serviceApi.fetchCategoriesWithSubcategories(),
        ])

        // Services data now contains flattened services with category context
        setServices(servicesData)

        // Categories data for filter panel options
        setCategories(categoriesData)
      } catch (err) {
        console.error("API fetch error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Optimized filtering with memoization
  const filteredServices = services.filter((service) => {
    const searchMatch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(service.categorySlug)

    const subcategoryMatch =
      filters.subcategories.length === 0 || filters.subcategories.includes(service.subCategorySlug)

    return searchMatch && categoryMatch && subcategoryMatch
  })

  const handleDeleteService = async (service) => {
    if (window.confirm(`Delete ${service.name} permanently?`)) {
      try {
        await serviceApi.deleteService(service.categorySlug, service.subCategorySlug, service.slug)
        setServices((prev) => prev.filter((s) => s._id !== service._id))
        alert("Service deleted successfully")
      } catch (err) {
        console.error("Delete error:", err)
        alert(`Delete failed: ${err.message}`)
      }
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
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
            <p className="text-sm text-red-700">Error loading services: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Services</h1>
        <Link
          to="/admin/services/new"
          className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Service
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 pl-10"
          />
        </div>
      </div>

      <FilterPanel categories={categories} selectedFilters={filters} onFilterChange={handleFilterChange} />

      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No services found matching your criteria.</p>
          <Link
            to="/admin/services/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
          >
            Add New Service
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} onDelete={handleDeleteService} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ServiceList

