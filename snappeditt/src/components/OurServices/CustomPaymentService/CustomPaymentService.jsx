"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"

const CustomPaymentForm = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/custom-payment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userDetails: {
            fullName: data.fullName,
            email: data.email,
            orderNumber: data.orderNumber,
          },
          serviceType: data.orderType,
          orderDetails: data.orderDetails
        })
      });

      const result = await response.json();

      if (!response.ok) { // Handle server errors
        throw new Error(result.error || "Failed to create order");
      }

      if (result.success) {
        navigate("/payment-form", {
          state: {
            ...data,
            dbOrderId: result.dbOrderId // Remove paypalOrderId from here
          }
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message); // Show actual error message
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#fff5f5] to-[#f0f9ff] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    >
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 bg-[#ff4d4d] text-white text-center">
          <h1 className="text-3xl font-bold font-cursive">Custom Payment Services</h1>
          <p className="mt-2">Secure Payment Gateway</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                  id="fullName"
                  {...register("fullName", { required: "Full name is required" })}
                  className={`peer w-full px-4 pt-6 pb-2 rounded-lg border ${errors.fullName ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#ff4d4d] focus:border-transparent placeholder-transparent`}
                  placeholder="Full Name"
                />
                <label
                  htmlFor="fullName"
                  className="absolute top-2 left-4 text-xs font-medium text-gray-500 transition-all 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 
                  peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#ff4d4d]"
                >
                  Full Name
                </label>
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
              </div>

              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`peer w-full px-4 pt-6 pb-2 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#ff4d4d] focus:border-transparent placeholder-transparent`}
                  placeholder="Email"
                />
                <label
                  htmlFor="email"
                  className="absolute top-2 left-4 text-xs font-medium text-gray-500 transition-all 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 
                  peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#ff4d4d]"
                >
                  Email
                </label>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  id="orderNumber"
                  {...register("orderNumber", { required: "Order number is required" })}
                  className={`peer w-full px-4 pt-6 pb-2 rounded-lg border ${errors.orderNumber ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#ff4d4d] focus:border-transparent placeholder-transparent`}
                  placeholder="Order Number"
                />
                <label
                  htmlFor="orderNumber"
                  className="absolute top-2 left-4 text-xs font-medium text-gray-500 transition-all 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 
                  peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#ff4d4d]"
                >
                  Order Number
                </label>
                {errors.orderNumber && <p className="text-red-500 text-sm mt-1">{errors.orderNumber.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-4 border rounded-lg hover:border-[#ff4d4d] cursor-pointer transition-all">
                <input
                  type="radio"
                  value="existing"
                  {...register("orderType")}
                  className="form-radio text-[#ff4d4d] focus:ring-[#ff4d4d] h-5 w-5"
                />
                <div>
                  <span className="block text-gray-900 font-medium">Existing Order</span>
                  <span className="block text-sm text-gray-500">Modify previous edits</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border rounded-lg hover:border-[#ff4d4d] cursor-pointer transition-all">
                <input
                  type="radio"
                  value="new"
                  {...register("orderType")}
                  className="form-radio text-[#ff4d4d] focus:ring-[#ff4d4d] h-5 w-5"
                />
                <div>
                  <span className="block text-gray-900 font-medium">New Order</span>
                  <span className="block text-sm text-gray-500">Start fresh Order</span>
                </div>
              </label>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="orderDetails"
              {...register("orderDetails")}
              rows="4"
              className="peer w-full px-4 pt-6 pb-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff4d4d] focus:border-transparent placeholder-transparent"
              placeholder="Order Details"
            ></textarea>
            <label
              htmlFor="orderDetails"
              className="absolute top-2 left-4 text-xs font-medium text-gray-500 transition-all 
              peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#ff4d4d]"
            >
              Order Details (if any)
            </label>
          </div>

          <div className="flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#ff4d4d] text-white rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-[#ff3333] transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span>Processing...</span>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {isSubmitting && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-500 mt-4">
                Redirecting to payment page...
              </motion.p>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default CustomPaymentForm
