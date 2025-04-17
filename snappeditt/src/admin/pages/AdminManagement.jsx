"use client"

import { useState, useEffect } from "react"
import { useAdmin } from "../contexts/AdminContext"
import * as adminApi from "../api/adminApi"
import { PlusIcon, PencilIcon, TrashIcon, ShieldCheckIcon } from "../components/Icons"

function AdminManagement() {
  const { admin } = useAdmin()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "admin",
    isActive: true,
  })

  // Check if current admin is super-admin
  const isSuperAdmin = admin?.role === "super-admin"

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true)
        const data = await adminApi.getAllAdmins()
        if (Array.isArray(data)) {
          setAdmins(data)
        } else {
          console.error("Expected array of admins but got:", data)
          setAdmins([])
        }
      } catch (err) {
        console.error("Error fetching admins:", err)
        setError(err.message || "Failed to fetch admin users")
      } finally {
        setLoading(false)
      }
    }

    if (isSuperAdmin) {
      fetchAdmins()
    } else {
      setLoading(false)
    }
  }, [isSuperAdmin])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "admin",
      isActive: true,
    })
    setEditingAdmin(null)
  }

  const handleEditClick = (adminData) => {
    if (!adminData || !adminData._id) {
      console.error("Invalid admin data:", adminData)
      return
    }

    setEditingAdmin(adminData)
    setFormData({
      fullName: adminData.fullName || "",
      email: adminData.email || "",
      password: "", // Don't populate password for security
      role: adminData.role || "admin",
      isActive: adminData.isActive !== false, // Default to true if not specified
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      if (editingAdmin && editingAdmin._id) {
        // Update existing admin
        const updatedAdmin = await adminApi.updateAdmin(editingAdmin._id, {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive,
          ...(formData.password ? { password: formData.password } : {}),
        })

        if (updatedAdmin && updatedAdmin._id) {
          setAdmins(admins.map((a) => (a._id === updatedAdmin._id ? updatedAdmin : a)))
          setShowForm(false)
          resetForm()
        } else {
          setError("Failed to update admin: Invalid response from server")
        }
      } else {
        // Create new admin
        const newAdmin = await adminApi.createAdmin(formData)
        if (newAdmin && newAdmin._id) {
          setAdmins([...admins, newAdmin])
          setShowForm(false)
          resetForm()
        } else {
          setError("Failed to create admin: Invalid response from server")
        }
      }
    } catch (err) {
      console.error("Admin save error:", err)
      setError(err.message || "Failed to save admin")
    }
  }

  const handleDeleteAdmin = async (adminId) => {
    if (!adminId) {
      console.error("Invalid admin ID")
      return
    }

    if (window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      try {
        await adminApi.deleteAdmin(adminId)
        setAdmins(admins.filter((a) => a._id !== adminId))
      } catch (err) {
        console.error("Admin deletion error:", err)
        setError(err.message || "Failed to delete admin")
      }
    }
  }

  // Generate avatar from name
  const getInitials = (name) => {
    if (!name) return "A"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getProfileColor = (name) => {
    if (!name) return "bg-indigo-600"

    const colors = [
      "bg-indigo-600",
      "bg-blue-600",
      "bg-green-600",
      "bg-yellow-600",
      "bg-red-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-teal-600",
    ]

    // Simple hash function to get consistent color
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
  }

  if (!isSuperAdmin) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <ShieldCheckIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">You need super-admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    )
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Admin Management</h2>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Admin
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>}

      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{editingAdmin ? "Edit Admin" : "Add New Admin"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {editingAdmin ? "New Password (leave blank to keep current)" : "Password"}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingAdmin}
                minLength={8}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div className="flex items-center h-full pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active Account
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
              >
                {editingAdmin ? "Update Admin" : "Add Admin"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Admin
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
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
            {admins.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No admins found
                </td>
              </tr>
            ) : (
              admins.map((adminUser) => (
                <tr key={adminUser._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 rounded-full ${getProfileColor(adminUser.fullName)} flex items-center justify-center text-white font-medium`}
                      >
                        {getInitials(adminUser.fullName)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{adminUser.fullName}</div>
                        <div className="text-sm text-gray-500">{adminUser.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${adminUser.role === "super-admin"
                        ? "bg-purple-100 text-purple-800"
                        : adminUser.role === "support"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                        }`}
                    >
                      {adminUser.role === "super-admin"
                        ? "Super Admin"
                        : adminUser.role === "support"
                          ? "Support"
                          : "Admin"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${adminUser.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                      {adminUser.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditClick(adminUser)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      {/* Don't allow deleting yourself */}
                      {admin && adminUser._id !== admin._id && (
                        <button
                          onClick={() => handleDeleteAdmin(adminUser._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminManagement

