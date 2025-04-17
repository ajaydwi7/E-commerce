"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { LockIcon, DollarSign } from "lucide-react"

const PaymentForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm()
  const formData = location.state || {}
  const [isProcessing, setIsProcessing] = useState(false)
  const [amountValid, setAmountValid] = useState(false)
  const [buttonReady, setButtonReady] = useState(false)
  const [paypalOrderData, setPaypalOrderData] = useState(null)
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    setValue("description", formData.description || "")
    setValue("price", formData.price || "")
    setValue("quantity", 1) // Force quantity to 1
  }, [formData, setValue])

  // Validate price in real-time
  useEffect(() => {
    const price = Number.parseFloat(watch("price"))
    setAmountValid(
      !isNaN(price) &&
      price > 0 &&
      price < 100000 && // Add upper limit
      /^\d+(\.\d{1,2})?$/.test(watch("price")), // Validate 2 decimal places
    )
  }, [watch("price")])


  useEffect(() => {
    const timer = setInterval(() => {
      if (window.paypal && window.paypal.Buttons) {
        setSdkReady(true);
        clearInterval(timer);
      }
    }, 500);

    return () => clearInterval(timer);
  }, []);
  // Manual form submission to create PayPal order and redirect
  const handleManualSubmit = async (formData) => {
    try {
      setIsProcessing(true)
      const price = Number.parseFloat(formData.price)

      if (!price || price <= 0) {
        toast.error("Please enter a valid payment amount")
        setIsProcessing(false)
        return
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/custom-payment/create-paypal-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dbOrderId: location.state?.dbOrderId,
          amount: price.toFixed(2),
          description: formData.description,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Payment setup failed")
      }

      console.log("PayPal order created:", responseData)

      // If we have an approveUrl, redirect to it
      if (responseData.approveUrl) {
        // Store order data in localStorage before redirecting
        localStorage.setItem(
          "paypalOrderData",
          JSON.stringify({
            orderId: responseData.paypalOrderId,
            dbOrderId: location.state?.dbOrderId,
            amount: price.toFixed(2),
            description: formData.description,
          }),
        )

        // Redirect to PayPal
        window.location.href = responseData.approveUrl
      } else {
        throw new Error("No PayPal approval URL received")
      }
    } catch (error) {
      console.error("PayPal order creation error:", error)
      toast.error(error.message || "Failed to set up payment")
      setIsProcessing(false)
    }
  }

  // PayPal SDK createOrder handler (fallback)
  const createOrder = async (data, actions) => {
    try {
      setIsProcessing(true)
      const price = Number.parseFloat(watch("price"))

      if (!price || price <= 0) {
        throw new Error("Please enter a valid payment amount")
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/custom-payment/create-paypal-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dbOrderId: location.state?.dbOrderId,
          amount: price.toFixed(2),
          description: watch("description"),
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Payment setup failed")
      }

      console.log("PayPal order created:", responseData)
      setPaypalOrderData({
        orderId: responseData.paypalOrderId,
        dbOrderId: location.state?.dbOrderId,
        amount: price.toFixed(2),
        description: watch("description"),
      })

      return responseData.paypalOrderId
    } catch (error) {
      console.error("PayPal order creation error:", error)
      toast.error(error.message || "Failed to set up payment")
      setIsProcessing(false)
      throw error
    }
  }

  // Update onApprove handler
  const onApprove = async (data, actions) => {
    try {
      console.log("Payment approved:", data)

      // Capture the funds from the transaction
      const captureResult = await actions.order.capture()
      console.log("Capture result:", captureResult)

      // Then notify your server about the completed payment
      const captureResponse = await fetch(`${import.meta.env.VITE_API_URL}/custom-payment/capture/${data.orderID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: captureResult.purchase_units[0].amount.value,
          dbOrderId: location.state?.dbOrderId,
        }),
      })

      const result = await captureResponse.json()

      if (!captureResponse.ok) {
        throw new Error(result.error || "Payment verification failed")
      }

      if (result.success) {
        toast.success("Payment successful! Order confirmed.")
        navigate("/thank-you", {
          state: {
            success: true,
            order: result.order,
            paypalOrderId: data.orderID,
          },
        })
      }
    } catch (error) {
      console.error("Payment capture error:", error)
      toast.error(error.message || "Payment processing failed")
      setIsProcessing(false)
    }
  }

  // Add error boundary
  const onError = (err) => {
    console.error("PayPal Error:", err)
    toast.error("Payment failed. Please try again or contact support.")
    setIsProcessing(false)
  }

  const onCancel = (data) => {
    console.log("Payment cancelled:", data)
    toast.info("Payment cancelled. You can try again when ready.")
    setIsProcessing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f0f9ff] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 bg-[#0070ba] text-white text-center">
          <h2 className="text-2xl font-bold">SnappEditt Payment</h2>
          <p className="mt-1 text-sm">Secure PayPal Checkout</p>
        </div>

        <form onSubmit={handleSubmit(handleManualSubmit)} className="px-8 py-6 space-y-6">
          {/* Description Field */}
          <div className="relative">
            <input
              id="description"
              {...register("description", { required: "Description is required" })}
              className="peer w-full px-4 pt-6 pb-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0070ba] focus:border-transparent placeholder-transparent"
              placeholder="Description"
            />
            <label
              htmlFor="description"
              className="absolute top-2 left-4 text-xs font-medium text-gray-500 transition-all 
              peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0070ba]"
            >
              Service Description *
            </label>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Price Input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="relative">
                <input
                  id="price"
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0.01, message: "Amount must be greater than 0" },
                  })}
                  className="peer w-full px-4 pt-6 pb-2 pl-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0070ba] focus:border-transparent placeholder-transparent"
                  placeholder="Price"
                  step="0.01"
                />
                <span className="absolute left-3 top-4 text-gray-500">
                  <DollarSign className="w-4 h-4" />
                </span>
                <label
                  htmlFor="price"
                  className="absolute top-2 left-8 text-xs font-medium text-gray-500 transition-all 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 
                  peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0070ba]"
                >
                  Payment Amount (USD) *
                </label>
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            {/* Disabled Quantity Field */}
            <div className="relative">
              <div className="relative">
                <input
                  id="quantity"
                  type="number"
                  value="1"
                  disabled
                  className="w-full px-4 pt-6 pb-2 rounded-lg border border-gray-200 bg-gray-50 cursor-not-allowed"
                />
                <label htmlFor="quantity" className="absolute top-2 left-4 text-xs font-medium text-gray-500">
                  Quantity
                </label>
              </div>
            </div>
          </div>

          {/* PayPal Button Section */}
          <div className="border-t pt-6 space-y-4">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-10 h-10 border-4 border-[#0070ba] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-600">Processing payment...</p>
              </div>
            ) : (
              <>
                {/* Manual PayPal Checkout Button */}
                <button
                  type="submit"
                  disabled={!amountValid}
                  className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <span className="mr-2">Proceed to PayPal</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.5 12.5L12 20L4.5 12.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M12 4V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Fallback PayPal SDK Buttons */}
                <div className="mt-4">
                  <p className="text-sm text-center text-gray-500 mb-3">Or pay directly with PayPal:</p>
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={(error) => {
                      console.error("PayPal error:", error);
                      toast.error("An error occurred with PayPal. Please try again.");
                    }}
                    onCancel={() => {
                      toast.info("Payment cancelled. You can try again when ready.");
                    }}
                    style={{
                      layout: "vertical",
                      color: "gold",
                      shape: "rect",
                      label: "checkout",
                      height: 48,
                      tagline: false,
                    }}
                    disabled={!amountValid || isProcessing}
                    forceReRender={[amountValid, watch("description")]}
                  />
                </div>
              </>
            )}
          </div>
        </form>

        {/* Footer Section */}
        <div className="px-8 py-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex space-x-4">
              <a href="/privacy-policy" className="text-gray-600 hover:text-gray-900">
                Privacy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-gray-900">
                Terms
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">Secured by</span>
              <LockIcon className="w-4 h-4" />
              <span className="font-medium text-blue-500">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PaymentForm
