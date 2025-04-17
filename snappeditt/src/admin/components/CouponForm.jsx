"use client"

import { useState, useEffect } from "react"
import { createCoupon, updateCoupon } from "../api/couponApi"

function CouponForm({ initialData = null, onCouponCreated, onCouponUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expirationDate: "",
    maxUses: "",
    minCartValue: "0",
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const isEditing = !!initialData

  useEffect(() => {
    if (initialData) {
      // Format the date to YYYY-MM-DD for the input field
      const formattedDate = initialData.expirationDate
        ? new Date(initialData.expirationDate).toISOString().split("T")[0]
        : ""

      setFormData({
        code: initialData.code || "",
        discountType: initialData.discountType || "percentage",
        discountValue: initialData.discountValue || "",
        expirationDate: formattedDate,
        maxUses: initialData.maxUses || "",
        minCartValue: initialData.minCartValue || "0",
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required"
    }

    if (!formData.discountValue) {
      newErrors.discountValue = "Discount value is required"
    } else if (isNaN(formData.discountValue) || Number(formData.discountValue) <= 0) {
      newErrors.discountValue = "Discount value must be a positive number"
    } else if (formData.discountType === "percentage" && Number(formData.discountValue) > 100) {
      newErrors.discountValue = "Percentage discount cannot exceed 100%"
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = "Expiration date is required"
    } else if (new Date(formData.expirationDate) < new Date() && !isEditing) {
      // Only check for future date when creating a new coupon
      newErrors.expirationDate = "Expiration date must be in the future"
    }

    if (formData.maxUses && (isNaN(formData.maxUses) || Number(formData.maxUses) <= 0)) {
      newErrors.maxUses = "Max uses must be a positive number"
    }

    if (isNaN(formData.minCartValue) || Number(formData.minCartValue) < 0) {
      newErrors.minCartValue = "Minimum cart value must be a non-negative number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const couponData = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue),
        maxUses: formData.maxUses ? Number(formData.maxUses) : null,
        minCartValue: Number(formData.minCartValue),
      }

      if (isEditing) {
        // Update existing coupon
        const updatedCoupon = await updateCoupon(initialData._id, couponData)
        onCouponUpdated(updatedCoupon)
      } else {
        // Create new coupon
        couponData.timesUsed = 0
        const newCoupon = await createCoupon(couponData)
        onCouponCreated(newCoupon)
      }
    } catch (err) {
      setErrors({ submit: err.message })
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
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
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Coupon Code *
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase ${errors.code ? "border-red-500" : ""}`}
            placeholder="e.g. SUMMER20"
            disabled={isEditing} // Disable code editing for existing coupons
          />
          {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
        </div>

        <div>
          <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
            Discount Type *
          </label>
          <select
            id="discountType"
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </div>

        <div>
          <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
            Discount Value *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{formData.discountType === "percentage" ? "%" : "$"}</span>
            </div>
            <input
              type="number"
              id="discountValue"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              min="0"
              step={formData.discountType === "percentage" ? "1" : "0.01"}
              className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 pl-7 ${errors.discountValue ? "border-red-500" : ""}`}
            />
          </div>
          {errors.discountValue && <p className="mt-1 text-sm text-red-600">{errors.discountValue}</p>}
        </div>

        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
            Expiration Date *
          </label>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.expirationDate ? "border-red-500" : ""}`}
          />
          {errors.expirationDate && <p className="mt-1 text-sm text-red-600">{errors.expirationDate}</p>}
        </div>

        <div>
          <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700">
            Max Uses (leave empty for unlimited)
          </label>
          <input
            type="number"
            id="maxUses"
            name="maxUses"
            value={formData.maxUses}
            onChange={handleChange}
            min="1"
            step="1"
            className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.maxUses ? "border-red-500" : ""}`}
          />
          {errors.maxUses && <p className="mt-1 text-sm text-red-600">{errors.maxUses}</p>}
        </div>

        <div>
          <label htmlFor="minCartValue" className="block text-sm font-medium text-gray-700">
            Minimum Cart Value ($)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              id="minCartValue"
              name="minCartValue"
              value={formData.minCartValue}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 pl-7 ${errors.minCartValue ? "border-red-500" : ""}`}
            />
          </div>
          {errors.minCartValue && <p className="mt-1 text-sm text-red-600">{errors.minCartValue}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500" disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500" disabled={submitting}>
          {submitting ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Coupon" : "Create Coupon"}
        </button>
      </div>
    </form>
  )
}

export default CouponForm

