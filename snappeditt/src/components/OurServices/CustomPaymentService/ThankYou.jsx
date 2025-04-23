"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Home, AlertCircle } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const ThankYou = () => {
  const location = useLocation()
  const [orderDetails, setOrderDetails] = useState({
    orderId: "Unknown",
    date: new Date().toLocaleDateString(),
    status: "Completed",
    amount: "$0.00",
    paypalId: "Unknown",
  })
  const [isSuccess, setIsSuccess] = useState(true)

  useEffect(() => {
    // Check if we have order details in location state
    if (location.state?.order) {
      const order = location.state.order
      setOrderDetails({
        orderId: order.customOrderId || "SNP-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date(order.createdAt || Date.now()).toLocaleDateString(),
        status: order.payment?.status || "Completed",
        amount: `$${order.serviceDetails?.price || "0.00"}`,
        paypalId: location.state.paypalOrderId || order.payment?.paypalOrderId || "Unknown",
      })
      setIsSuccess(true)
    } else if (location.state?.error) {
      setIsSuccess(false)
    }
  }, [location])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#f0fff4] to-[#f0f9ff] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-10 flex flex-col items-center">
          <div className={`${isSuccess ? "bg-green-100" : "bg-red-100"} p-3 rounded-full`}>
            {isSuccess ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <AlertCircle className="h-16 w-16 text-red-500" />
            )}
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900 text-center">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h2>
          <p className="mt-2 text-center text-gray-600">
            {isSuccess
              ? "Thank you for your payment. Your order has been processed successfully."
              : "We couldn't process your payment. Please try again or contact support."}
          </p>

          {isSuccess && (
            <div className="mt-8 border-t border-gray-200 pt-6 w-full">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PayPal Transaction:</span>
                    <span className="font-medium">{orderDetails.paypalId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{orderDetails.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{orderDetails.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">{orderDetails.status}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#ff4d4d] hover:bg-[#ff3333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4d4d]"
            >
              <Home className="mr-2 h-5 w-5" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ThankYou
