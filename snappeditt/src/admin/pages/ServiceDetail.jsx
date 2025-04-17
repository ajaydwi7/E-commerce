"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { PencilIcon, TrashIcon, ArrowLeftIcon } from "../components/Icons"
import * as serviceApi from "../api/serviceApi"

function ServiceDetail() {
  const { categorySlug, subCategorySlug, serviceSlug } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const serviceData = await serviceApi.fetchServiceBySlugs(categorySlug, subCategorySlug, serviceSlug)
        setService(serviceData)
      } catch (err) {
        console.error("Error fetching service:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceData()
  }, [categorySlug, subCategorySlug, serviceSlug])

  const handleDeleteService = async () => {
    if (window.confirm(`Are you sure you want to delete ${service.name}?`)) {
      try {
        await serviceApi.deleteService(categorySlug, subCategorySlug, serviceSlug)
        window.location.href = "/admin/services"
      } catch (err) {
        console.error("Error deleting service:", err)
        setError(err.message)
      }
    }
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
            <p className="text-sm text-red-700">Error loading service: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">Service not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/admin/services" className="flex items-center text-indigo-600 hover:text-indigo-800">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Back to Services</span>
          </Link>
          <div className="flex space-x-2">
            <Link
              to={`/admin/services/edit/${categorySlug}/${subCategorySlug}/${serviceSlug}`}
              className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Service
            </Link>
            <button
              onClick={handleDeleteService}
              className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Service
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 md:h-80 bg-gray-200">
            {service.featureImage ? (
              <img
                src={service.featureImage || "/placeholder.svg"}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                No Feature Image
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="flex space-x-2 mb-2">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                      {service.category}
                    </span>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">
                      {service.subcategory}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{service.name}</h1>
                </div>
                <div className="text-xl md:text-2xl font-bold text-white bg-indigo-600 px-4 py-2 rounded-lg">
                  ${service.basePrice}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                  <div className="prose max-w-none text-gray-600">
                    {service.description ? (
                      <p>{service.description}</p>
                    ) : (
                      <p className="text-gray-400 italic">No description provided</p>
                    )}
                  </div>
                </div>

                {/* Before/After Images */}
                {service.images && service.images.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Before/After Images</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.images.map((image, index) => (
                        <div key={index} className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Before</p>
                              <img
                                src={image.before || "/placeholder.svg"}
                                alt={`Before ${index + 1}`}
                                className="w-full h-40 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "https://via.placeholder.com/300x200?text=No+Image"
                                }}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">After</p>
                              <img
                                src={image.after || "/placeholder.svg"}
                                alt={`After ${index + 1}`}
                                className="w-full h-40 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "https://via.placeholder.com/300x200?text=No+Image"
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variation Types */}
                {service.variationTypes && service.variationTypes.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Variations</h2>
                    <div className="space-y-4">
                      {service.variationTypes.map((variation, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-900">{variation.name}</h3>
                            {variation.required && (
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                                Required
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {variation.options.map((option, optIndex) => (
                              <div key={optIndex} className="bg-gray-50 p-2 rounded">
                                <p className="font-medium text-gray-900">{option.name}</p>
                                {option.description && <p className="text-sm text-gray-600">{option.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Combinations */}
                {service.priceCombinations && service.priceCombinations.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Price Combinations</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Combination
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {service.priceCombinations.map((combo, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {combo.combination.join(", ") || "Base Price"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                ${combo.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Service Details</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="text-gray-900">{service.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Subcategory</p>
                      <p className="text-gray-900">{service.subcategory}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Slug</p>
                      <p className="text-gray-900">{service.slug}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Features</h2>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span
                            className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full ${feature.included ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                          >
                            {feature.included ? "✓" : "✕"}
                          </span>
                          <span className={`${!feature.included ? "text-gray-400 line-through" : "text-gray-900"}`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetail

