"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ServiceCard from "../components/ServiceCard"
import FilterPanel from "../components/FilterPanel"
import { PlusIcon, SearchIcon } from "../components/Icons"

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
        // Fetch all services
        const servicesResponse = await fetch("/api/get-services")
        if (!servicesResponse.ok) {
          throw new Error("Failed to fetch services")
        }
        const servicesData = await servicesResponse.json()

        // Fetch categories with subcategories
        const categoriesResponse = await fetch("/api/categories-with-subcategories")
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categoriesData = await categoriesResponse.json()

        setServices(servicesData)
        setCategories(categoriesData)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleDeleteService = async (service) => {
    if (window.confirm(`Are you sure you want to delete ${service.name}?`)) {
      try {
        const response = await fetch(
          `/api/categories/${service.categorySlug}/subcategories/${service.subCategorySlug}/services/${service.slug}`,
          {
            method: "DELETE",
          },
        )

        if (!response.ok) {
          throw new Error("Failed to delete service")
        }

        // Remove the service from the state
        setServices(services.filter((s) => s._id !== service._id))

        alert("Service deleted successfully")
      } catch (err) {
        alert(`Error deleting service: ${err.message}`)
      }
    }
  }

  // Filter services based on search term and selected filters
  const filteredServices = services.filter((service) => {
    // Search filter
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))

    // Category filter
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(service.categorySlug)

    // Subcategory filter
    const matchesSubcategory =
      filters.subcategories.length === 0 || filters.subcategories.includes(service.subCategorySlug)

    return matchesSearch && matchesCategory && matchesSubcategory
  })

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
        <Link to="/services/new" className="btn btn-primary">
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
            className="form-input pl-10"
          />
        </div>
      </div>

      <FilterPanel categories={categories} selectedFilters={filters} onFilterChange={handleFilterChange} />

      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No services found matching your criteria.</p>
          <Link to="/services/new" className="btn btn-primary">
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

