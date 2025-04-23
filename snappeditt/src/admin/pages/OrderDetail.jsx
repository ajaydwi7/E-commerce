"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { fetchOrderById, cancelOrder, updateOrderStatus } from "../api/orderApi"

function OrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        setLoading(true)
        const orderData = await fetchOrderById(orderId)
        setOrder(orderData)
        setNewStatus(orderData.status)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    loadOrderData()
  }, [orderId])

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(orderId)
      // Refresh order data
      const updatedOrder = await fetchOrderById(orderId)
      setOrder(updatedOrder)
      setShowCancelConfirm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleStatusChange = async () => {
    if (newStatus === order.status) return

    try {
      await updateOrderStatus(orderId, newStatus)
      // Refresh order data
      const updatedOrder = await fetchOrderById(orderId)
      setOrder(updatedOrder)
    } catch (err) {
      setError(err.message)
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
            <p className="text-sm text-red-700">Error loading order details: {error}</p>
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
            <p className="text-sm text-yellow-700">Order not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <div className="flex space-x-2">
          <Link to="/admin/orders" className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500">
            Back to Orders
          </Link>
          {order.status !== "Cancelled" && (
            <button onClick={() => setShowCancelConfirm(true)} className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500">
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Cancellation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowCancelConfirm(false)} className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500">
                No, Keep Order
              </button>
              <button onClick={handleCancelOrder} className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500">
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Order ID</p>
              <p className="mt-1 text-sm text-gray-900">{order.customOrderId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="mt-1 text-sm text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="mt-1 flex items-center">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${order.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Status</p>
              <div className="mt-1 flex items-center">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${order.paymentStatus === "Completed"
                      ? "bg-green-100 text-green-800"
                      : order.paymentStatus === "Failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
            {order.paypalOrderId && (
              <div>
                <p className="text-sm font-medium text-gray-500">PayPal Order ID</p>
                <p className="mt-1 text-sm text-gray-900">{order.paypalOrderId}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="mt-1 text-sm text-gray-900">{order.billingDetails.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-sm text-gray-900">{order.billingDetails.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="mt-1 text-sm text-gray-900">{order.billingDetails.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="mt-1 text-sm text-gray-900">
                {order.billingDetails.address}, {order.billingDetails.city}, {order.billingDetails.state}{" "}
                {order.billingDetails.zip}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Update Order</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Order Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={order.status === "Cancelled"}
                className="mt-1 form-input w-full"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <button
              onClick={handleStatusChange}
              disabled={order.status === "Cancelled" || newStatus === order.status}
              className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500; w-full border-primaryRed-500 hover:text-white"
            >
              Update Status
            </button>
            <a
              href={`${import.meta.env.VITE_API_URL}/order/${order._id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none  focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 border-indigo-300 hover:bg-gray-50 focus:ring-indigo-500 w-full"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              View Invoice
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {item.featureImage && (
                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={item.featureImage || "/placeholder.svg"}
                            alt={item.serviceName}
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.serviceName}</div>
                        {item.selectedVariations && item.selectedVariations.length > 0 && (
                          <div className="text-sm text-gray-500">
                            {item.selectedVariations.map((variation, i) => (
                              <div key={i}>
                                {variation.variationType}: {variation.optionName}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${item.basePrice.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${(item.finalPrice * item.quantity).toFixed(2)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  Subtotal:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0).toFixed(2)}
                </td>
              </tr>
              {order.discountApplied > 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-green-600">
                    Discount {order.couponCode && `(${order.couponCode})`}:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    -${order.discountApplied.toFixed(2)}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  Total:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900">
                  ${order.totalCost.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail

