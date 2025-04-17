const express = require("express");
const { client } = require("../helper/paypal");
const paypal = require("@paypal/checkout-server-sdk");
const router = express.Router();
const ServiceOrder = require("../models/ServiceOrder");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
  "/create-order",
  asyncHandler(async (req, res) => {
    let { orderTotal, items, discount = 0 } = req.body;
    orderTotal = Number(orderTotal);
    discount = Number(discount);
    const finalTotal = orderTotal - discount;

    if (isNaN(orderTotal) || isNaN(discount)) {
      return res.status(400).json({ error: "Invalid numeric values" });
    }
    if (!orderTotal || !items || items.length === 0) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: finalTotal.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: parseFloat(orderTotal).toFixed(2),
              },
              discount: { currency_code: "USD", value: discount.toFixed(2) },
            },
          },
          items: items.map((item) => ({
            name: item.name,
            unit_amount: {
              currency_code: "USD",
              value: item.unit_amount.value,
            },
            quantity: item.quantity,
          })),
        },
      ],
    });

    const order = await client.execute(request);
    res.status(200).json({
      id: order.result.id,
      status: order.result.status,
    });
  })
);

router.post(
  "/capture-order/:orderId",
  asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    const { payerId } = req.body;

    console.log("Incoming capture request:", {
      headers: req.headers,
      body: req.body,
      params: req.params,
    });

    if (!orderId || !payerId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({
      payer_id: payerId,
    });

    try {
      const capture = await client.execute(request);
      console.log("PayPal capture response:", capture);

      if (capture.result.status === "COMPLETED") {
        res.status(200).json({
          id: capture.result.id,
          status: capture.result.status,
          payer: capture.result.payer,
          purchase_units: capture.result.purchase_units.map((unit) => ({
            ...unit,
            amount: unit.amount || { value: "0.00", currency_code: "USD" },
          })),
        });
      } else {
        res.status(400).json({ error: "Payment capture failed" });
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
      res.status(500).json({
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  })
);

router.post("/webhook", async (req, res) => {
  try {
    const { event_type, resource } = req.body;

    // Update order status on successful payment
    if (event_type === "PAYMENT.CAPTURE.COMPLETED") {
      await ServiceOrder.findOneAndUpdate(
        { paypalOrderId: resource.id },
        { paymentStatus: "Completed" }
      );
    }

    res.status(200).end();
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

module.exports = router;
