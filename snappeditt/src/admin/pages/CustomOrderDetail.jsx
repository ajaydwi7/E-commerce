"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchCustomOrderById, updateCustomOrderStatus, deleteCustomOrder } from "../api/customOrderApi"
import { ArrowLeftIcon } from "../components/Icons"

function CustomOrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        const data = await fetchCustomOrderById(orderId)
        setOrder(data.order)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true)
      await updateCustomOrderStatus(orderId, newStatus)
      setOrder({ ...order, payment: { ...order.payment, status: newStatus } })
      setUpdating(false)
    } catch (err) {
      setError(err.message)
      setUpdating(false)
    }
  }

  const handleDeleteOrder = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    try {
      setUpdating(true)
      await deleteCustomOrder(orderId)
      navigate("/admin/custom-orders")
    } catch (err) {
      setError(err.message)
      setUpdating(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
            <p className="text-sm text-red-700">Error loading custom order: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
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
            <p className="text-sm text-yellow-700">Custom order not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/admin/custom-orders")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Custom Orders
          </button>
          <div className="flex space-x-2">
            {order.payment.status !== "completed" && (
              <button
                onClick={() => handleStatusChange("completed")}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Mark as Completed
              </button>
            )}
            {confirmDelete ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrder}
                  disabled={updating}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Confirm Delete
                </button>
              </div>
            ) : (
              <button
                onClick={handleDeleteOrder}
                disabled={updating}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Delete Order
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.customOrderId}</h1>
            <p className="text-sm text-gray-500">Created on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span
              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                order.payment.status,
              )}`}
            >
              {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{order.userDetails.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{order.userDetails.email}</span>
              </div>
              {order.serviceType === "existing" && order.userDetails.orderNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference Order:</span>
                  <span className="font-medium">{order.userDetails.orderNumber}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Order Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Type:</span>
                <span className="font-medium capitalize">{order.serviceType} Order</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">
                  ${order.serviceDetails.price ? order.serviceDetails.price.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{order.serviceDetails.quantity}</span>
              </div>
              {order.payment.paypalOrderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">PayPal Order ID:</span>
                  <span className="font-medium">{order.payment.paypalOrderId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          <div className="whitespace-pre-wrap">{order.orderDetails || "No details provided"}</div>
        </div>

        {order.serviceDetails.description && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Service Description</h2>
            <div className="whitespace-pre-wrap">{order.serviceDetails.description}</div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Payment Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${order.payment.status !== "draft" ? "bg-green-500 text-white" : "bg-gray-300"
                  }`}
              >
                1
              </div>
              <div>
                <p className="font-medium">Order Created</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${order.payment.status === "pending" || order.payment.status === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300"
                  }`}
              >
                2
              </div>
              <div>
                <p className="font-medium">Payment Initiated</p>
                <p className="text-sm text-gray-500">
                  {order.payment.status === "draft"
                    ? "Not started"
                    : order.payment.paypalOrderId
                      ? `PayPal Order ID: ${order.payment.paypalOrderId}`
                      : "In progress"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${order.payment.status === "completed" ? "bg-green-500 text-white" : "bg-gray-300"
                  }`}
              >
                3
              </div>
              <div>
                <p className="font-medium">Payment Completed</p>
                <p className="text-sm text-gray-500">
                  {order.payment.status === "completed" ? "Payment successful" : "Awaiting payment"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomOrderDetail
