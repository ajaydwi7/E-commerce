"use client"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const CustomPaymentSuccess = () => {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get the token from URL
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get("token")

        if (!token) {
          throw new Error("Payment token not found")
        }

        // Get stored order data
        const storedOrderData = localStorage.getItem("paypalOrderData")
        if (!storedOrderData) {
          throw new Error("Order data not found")
        }

        const orderData = JSON.parse(storedOrderData)

        // Capture the payment on your server
        const captureResponse = await fetch(`${import.meta.env.VITE_API_URL}/custom-payment/capture/${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: orderData.amount,
            dbOrderId: orderData.dbOrderId,
          }),
        })

        const result = await captureResponse.json()

        if (!captureResponse.ok) {
          throw new Error(result.error || "Payment verification failed")
        }

        // Clear the stored order data
        localStorage.removeItem("paypalOrderData")

        // Navigate to thank you page with order details
        navigate("/thank-you", {
          state: {
            success: true,
            order: result.order,
            paypalOrderId: token,
          },
        })
      } catch (error) {
        console.error("Payment processing error:", error)
        toast.error(error.message || "Failed to process payment")
        navigate("/payment-form", { state: { error: "Payment processing failed" } })
      } finally {
        setIsProcessing(false)
      }
    }

    processPayment()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Processing your payment...</h2>
        <p className="text-gray-500 mt-2">Please wait while we confirm your payment.</p>
      </div>
    </div>
  )
}

export default CustomPaymentSuccess
