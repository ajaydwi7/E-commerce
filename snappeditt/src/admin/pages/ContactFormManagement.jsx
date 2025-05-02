"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import * as contactApi from "../api/contactApi"
import {
  SearchIcon,
  FilterIcon,
  CheckIcon,
  TrashIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../components/Icons"

function ContactFormManagement() {
  const [contactForms, setContactForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [limit, setLimit] = useState(10)

  const fetchContactForms = useCallback(async () => {
    try {
      setLoading(true)
      const filters = {
        page: currentPage,
        limit,
      }

      if (statusFilter !== "all") {
        filters.status = statusFilter
      }

      if (dateFilter !== "all") {
        filters.dateRange = dateFilter
      }

      const data = await contactApi.getAllContactForms(filters)
      setContactForms(data.forms || [])
      setTotalPages(data.totalPages || 1)
      setTotalCount(data.totalCount || 0)
    } catch (err) {
      setError(err.message || "Failed to fetch contact forms")
    } finally {
      setLoading(false)
    }
  }, [currentPage, limit, statusFilter, dateFilter])

  useEffect(() => {
    fetchContactForms()
  }, [fetchContactForms])

  const handleStatusChange = async (formId, newStatus) => {
    try {
      await contactApi.updateContactFormStatus(formId, newStatus)
      setContactForms(contactForms.map((form) => (form._id === formId ? { ...form, status: newStatus } : form)))
    } catch (err) {
      setError(err.message || "Failed to update status")
    }
  }

  const handleDeleteForm = async (formId) => {
    if (window.confirm("Are you sure you want to delete this contact form submission?")) {
      try {
        await contactApi.deleteContactForm(formId)
        setContactForms(contactForms.filter((form) => form._id !== formId))
      } catch (err) {
        setError(err.message || "Failed to delete contact form")
      }
    }
  }

  const handleLimitChange = (e) => {
    setLimit(Number.parseInt(e.target.value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1) // Reset to first page when changing filter
  }

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value)
    setCurrentPage(1) // Reset to first page when changing filter
  }

  const filteredForms = contactForms.filter((form) => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      form.firstName?.toLowerCase().includes(searchTermLower) ||
      form.lastName?.toLowerCase().includes(searchTermLower) ||
      form.email?.toLowerCase().includes(searchTermLower) ||
      form.topic?.toLowerCase().includes(searchTermLower)
    )
  })

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading && contactForms.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Contact Form Submissions</h1>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>}

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or topic..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full md:w-80"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                  <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>

                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Topic
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredForms.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No contact form submissions found
                    </td>
                  </tr>
                ) : (
                  filteredForms.map((form) => (
                    <tr key={form._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {form.firstName} {form.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{form.phone || "No phone"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{form.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{form.topic}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(form.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(form.status)}`}
                        >
                          {form.status || "New"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/admin/contact-forms/${form._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleStatusChange(form._id, "completed")}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Completed"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteForm(form._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center rounded-lg shadow-md">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-4">
              Page {currentPage} of {totalPages} ({totalCount} items)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Prev
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactFormManagement
