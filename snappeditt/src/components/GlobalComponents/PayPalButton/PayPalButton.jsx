import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

const PayPalButton = ({ cartTotal, cartItems, onSuccess, disabled, userId, billingDetails, couponCode, discount }) => {
  const createOrder = async (data, actions) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      // Convert to number first before formatting
      const numericTotal = Number(cartTotal) || 0;
      const formattedTotal = numericTotal.toFixed(2);
      const response = await fetch(`${apiUrl}/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderTotal: numericTotal,
          items: cartItems.map((item) => ({
            name: item.serviceName || "Unnamed Service",
            unit_amount: { currency_code: "USD", value: (parseFloat(item.finalPrice ?? item.basePrice) || 0).toFixed(2), },
            quantity: parseInt(item.quantity, 10) || 1,
          })),
          discount: discount || 0,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create PayPal order");
      }

      const orderData = await response.json();
      return orderData.id;
    } catch (error) {
      console.error("PayPal create order error:", error);
      toast.error("Failed to create PayPal order. Please try again.");
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      if (!data.orderID || !data.payerID) throw new Error("Order ID or Payer ID is missing.");

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const captureResponse = await fetch(`${apiUrl}/paypal/capture-order/${data.orderID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderID, payerId: data.payerID }),
        credentials: "include",
      });

      if (!captureResponse.ok) {
        const errorData = await captureResponse.json();
        throw new Error(errorData.error || "Failed to capture payment");
      }
      // Validate cart items before saving
      if (!cartItems.every(item =>
        Number.isFinite(item.basePrice) &&
        Number.isFinite(item.finalPrice)
      )) {
        throw new Error("Invalid price configuration in cart items");
      }

      const captureData = await captureResponse.json();
      if (captureData.status === "COMPLETED") {
        const orderDetails = {
          user_id: userId,
          totalCost: Number(cartTotal - discount || 0).toFixed(2),
          paypalOrderId: captureData.id,
          billingDetails,
          items: cartItems.map((item) => ({
            serviceId: item.serviceId || item.id,
            serviceName: item.serviceName,
            basePrice: item.basePrice, // Add this line
            finalPrice: parseFloat(item.finalPrice ?? item.basePrice), // Changed from 'price'
            quantity: parseInt(item.quantity, 10),
            totalPrice: (parseFloat(item.finalPrice ?? item.basePrice) * parseInt(item.quantity, 10)).toFixed(2),
            featureImage: item.featureImage,
            formData: item.formData || {},
            selectedVariations: item.selectedVariations || [],
          })),
          couponCode: couponCode || null,
          discount: discount || 0,
          paymentStatus: 'Completed',
          invoiceUrl: captureData.invoiceUrl || `/api/order/${captureData.id}/invoice`
        };


        if (captureData.status === "COMPLETED") {
          const saveOrderResponse = await fetch(`${apiUrl}/order/confirm`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Idempotency-Key": data.orderID
            },
            body: JSON.stringify(orderDetails),
            credentials: "include",
          });

          if (!saveOrderResponse.ok) {
            const errorData = await saveOrderResponse.json();
            let message = "Payment succeeded but order creation failed";

            if (errorData.refundAttempted) {
              message += errorData.refundStatus === "Refunded"
                ? ". Full refund processed successfully"
                : ". Failed to process refund - contact support";
            }

            throw new Error(message);
          }

          const savedOrderData = await saveOrderResponse.json(); // Get saved order data
          toast.success("Payment successful! Order has been placed.");
          await onSuccess(savedOrderData); // Pass saved order data to onSuccess
        }
      }
    }
    catch (error) {
      console.error("Payment processing error:", error);
      toast.error(error.message || "Payment processing failed");
    }
  };

  return (
    <div className={`${disabled ? "opacity-50 pointer-events-none" : ""}`}>
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
        style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
        disabled={disabled}
      />
    </div>
  );
};

export default PayPalButton;