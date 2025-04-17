import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import PayPalButton from "../GlobalComponents/PayPalButton/PayPalButton";
import { FiUser, FiMail, FiHome, FiMapPin, FiSmartphone, FiCreditCard } from "react-icons/fi";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceStore, orders } = useGlobalContext();
  const cart = serviceStore.state?.cart || 0;
  // const cartTotal = location.state.cartTotal || 0;
  const { clearCart } = serviceStore;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    country: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateBillingDetails = () => {
    const { name, email, address, city, state, zip, phone, country } = billingDetails;
    const isValid = !!name && !!email && !!address && !!city && !!state && !!zip && !!phone && !!country;

    if (submissionAttempted && !isValid) {
      toast.error("Please fill in all required billing details.");
    }
    return isValid;
  };

  const handlePaymentSuccess = async (savedOrderData) => {
    setSubmissionAttempted(true);
    // Validate billing details (already done in PayPalButton, but double-check)
    if (!validateBillingDetails()) {
      setIsSubmitting(false);
      return;
    }
    try {
      setIsSubmitting(true);

      if (!savedOrderData?.order?._id) {
        throw new Error("Invalid order data received");
      }

      // Update frontend order state
      orders.addOrder(savedOrderData.order); // Add the saved order to the store

      // Clear cart and navigate
      await clearCart(location.state.userId);
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Post-payment error:", error);
      toast.error(error.message.includes("Invalid")
        ? "Order completed but invalid data received"
        : "Order completed but cart cleanup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFreeOrder = async () => {
    setSubmissionAttempted(true);
    if (!validateBillingDetails()) return;

    try {
      setIsSubmitting(true);

      const orderData = {
        user_id: location.state.userId,
        items: cart.map(item => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          basePrice: item.basePrice,
          finalPrice: item.finalPrice,
          quantity: item.quantity,
          featureImage: item.featureImage,
          selectedVariations: item.selectedVariations,
          formData: item.formData
        })),
        totalCost: 0,
        billingDetails,
        couponCode: location.state?.couponCode || null,
        discount: location.state?.discount || 0,
        // Explicitly omit paypalOrderId
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/order/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Add if using cookies/auth
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      const data = await response.json();
      orders.addOrder(data.order);
      await clearCart(location.state.userId);
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Full error details:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!cart.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
          <div className="text-purple-600 text-6xl mb-4 flex justify-center">
            <FiCreditCard className="inline-block" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Empty Cart</h2>
          <p className="text-gray-600 mb-6">Your cart is empty. Add some amazing items before checkout!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primaryRed to-primaryBlack p-8 text-white">
          <h1 className="text-4xl font-bold">Secure Checkout</h1>
          <p className="mt-2 opacity-90">Complete your purchase in just a few steps</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiCreditCard className="text-blue-600" />
                Order Summary
              </h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 hover:shadow transition-all animate-fade-in"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">{item.serviceName}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">
                        ${((item.finalPrice ?? item.basePrice) * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.finalPrice ?? item.basePrice} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${Number(location.state.cartTotal - location.state.discount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Billing & Payment */}
          <div className="space-y-6">
            <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiUser className="text-purple-600" />
                Billing Details
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: FiUser, name: "name", placeholder: "Full Name" },
                  { icon: FiMail, name: "email", placeholder: "Email", type: "email" },
                  { icon: FiSmartphone, name: "phone", placeholder: "Phone Number", type: "tel" },
                  { icon: FiHome, name: "address", placeholder: "Address" },
                  { icon: FiMapPin, name: "city", placeholder: "City" },
                  { icon: FiMapPin, name: "state", placeholder: "State" },
                  { icon: FiMapPin, name: "zip", placeholder: "ZIP Code" },
                  { icon: FiMapPin, name: "country", placeholder: "Country" },
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <field.icon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      placeholder={`${field.placeholder} *`}
                      value={billingDetails[field.name]}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all animate-fade-in"
                      required
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Section */}
            <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiCreditCard className="text-green-600" />
                Payment Method
              </h2>
              {location.state.cartTotal > 0 ? validateBillingDetails() ? (
                <div className="animate-fade-in">
                  <PayPalButton
                    cartTotal={location.state.cartTotal}
                    cartItems={cart}
                    onSuccess={handlePaymentSuccess}
                    disabled={isSubmitting}
                    phoneNumber={billingDetails.phone}
                    userId={location.state.userId}
                    billingDetails={billingDetails}
                    couponCode={location.state?.couponCode || null}
                    discount={location.state?.discount || 0}
                  />
                </div>
              ) : (
                <div className="text-center p-4 bg-yellow-50 rounded-lg text-yellow-700">
                  Complete all billing details to enable payment
                </div>
              ) : (
                <button
                  onClick={handleFreeOrder}
                  disabled={!validateBillingDetails() || isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </button>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;