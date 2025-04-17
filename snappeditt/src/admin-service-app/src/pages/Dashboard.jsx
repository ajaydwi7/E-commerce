"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { CubeIcon, TagIcon } from "../components/Icons"

function Dashboard() {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalCategories: 0,
    totalSubcategories: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/categories-with-subcategories")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const data = await response.json()

        // Calculate stats
        const totalCategories = data.length
        const totalSubcategories = data.reduce((acc, category) => acc + category.subCategories.length, 0)
        const totalServices = data.reduce(
          (acc, category) =>
            acc + category.subCategories.reduce((subAcc, subcategory) => subAcc + subcategory.services.length, 0),
          0,
        )

        setStats({
          totalServices,
          totalCategories,
          totalSubcategories,
        })

        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
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
            <p className="text-sm text-red-700">Error loading dashboard data: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <CubeIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <TagIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <TagIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Subcategories</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSubcategories}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/services/new"
              className="block w-full py-2 px-4 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700"
            >
              Add New Service
            </Link>
            <Link
              to="/categories"
              className="block w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 text-center rounded-md hover:bg-gray-50"
            >
              Manage Categories
            </Link>
            <Link
              to="/services"
              className="block w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 text-center rounded-md hover:bg-gray-50"
            >
              View All Services
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">API Connection</span>
              <span className="badge badge-green">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Database</span>
              <span className="badge badge-green">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-600">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

