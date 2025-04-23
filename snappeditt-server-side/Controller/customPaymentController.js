const CustomServiceOrder = require("../models/CustomOrder");
const paypal = require("@paypal/checkout-server-sdk");
const { client } = require("../helper/paypal");
const { sendCustomOrderConfirmation } = require("../utils/emailSender");

const createCustomOrder = async (req, res) => {
  try {
    const { userDetails, serviceType, orderDetails } = req.body;

    // Validate required fields (remove 'amount' check)
    if (!userDetails || !serviceType) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // validation for existing orders
    if (serviceType === "existing" && !userDetails.orderNumber) {
      return res
        .status(400)
        .json({ error: "Order number required for existing orders" });
    }
    // Create database record without PayPal details
    const newOrder = new CustomServiceOrder({
      userDetails,
      serviceType,
      orderDetails,
      serviceDetails: {
        price: 0, // Temporary value
        quantity: 1,
      },
      payment: {
        status: "draft",
      },
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      dbOrderId: newOrder._id,
      customOrderId: newOrder.customOrderId,
    });
  } catch (error) {
    console.error("Custom order creation error:", error);
    res.status(500).json({ error: "Failed to create custom order" });
  }
};

const createPayPalOrder = async (req, res) => {
  try {
    console.log("PayPal Order Request:", req.body);
    const { dbOrderId, amount, description } = req.body;

    if (!dbOrderId || !amount) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Validate database order exists first
    const existingOrder = await CustomServiceOrder.findById(dbOrderId);
    if (!existingOrder) {
      return res.status(404).json({ error: "Database order not found" });
    }

    if (isNaN(amount) || amount <= 0 || amount > 10000) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Create PayPal order with explicit return URLs
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: Number(amount).toFixed(2),
          },
          description: description || "Custom Service",
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/custom-payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/custom-payment-cancel`,
        user_action: "PAY_NOW", // Force redirect to PayPal
        shipping_preference: "NO_SHIPPING",
        brand_name: "SnappEditt",
        landing_page: "BILLING", // Use "LOGIN" for PayPal account login or "BILLING" for credit card entry
      },
    });

    const paypalOrder = await client.execute(request);
    console.log("PayPal Order Created:", paypalOrder.result);

    // Get the approval URL to redirect the user
    const approveLink = paypalOrder.result.links.find(
      (link) => link.rel === "approve"
    );

    // Update database
    await CustomServiceOrder.findByIdAndUpdate(
      dbOrderId,
      {
        "serviceDetails.price": amount,
        "serviceDetails.description": description,
        "payment.paypalOrderId": paypalOrder.result.id,
        "payment.status": "pending",
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      paypalOrderId: paypalOrder.result.id,
      approveUrl: approveLink ? approveLink.href : null, // Include the approval URL
    });
  } catch (error) {
    console.error("PayPal order creation error:", error);
    res.status(500).json({
      error: "Failed to create PayPal order",
      details: error.message,
    });
  }
};

const captureCustomPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    // 1. First check order status
    const orderRequest = new paypal.orders.OrdersGetRequest(orderId);
    const orderDetails = await client.execute(orderRequest);

    // 2. If not approved, attempt to capture anyway (common pattern)
    if (orderDetails.result.status === "CREATED") {
      console.warn(
        "Attempting to capture CREATED order - might be using manual approval"
      );
    }

    // 3. Proceed with capture regardless of status
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    const capture = await client.execute(captureRequest);

    // 4. Verify capture status
    if (capture.result.status !== "COMPLETED") {
      return res.status(400).json({ error: "Capture not completed" });
    }

    // 5. Update database
    const updatedOrder = await CustomServiceOrder.findOneAndUpdate(
      { "payment.paypalOrderId": orderId },
      {
        "serviceDetails.price": req.body.price,
        "payment.status": "completed",
        "payment.captureId": capture.result.id,
      },
      { new: true }
    );

    // Send confirmation email
    await sendCustomOrderConfirmation(
      updatedOrder.userDetails.email,
      updatedOrder
    );

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Payment capture error:", error);
    res
      .status(500)
      .json({ error: "Payment capture failed", details: error.message });
  }
};
module.exports = { createCustomOrder, createPayPalOrder, captureCustomPayment };
