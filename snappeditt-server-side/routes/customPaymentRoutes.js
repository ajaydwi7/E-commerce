const express = require("express");
const {
  createCustomOrder,
  createPayPalOrder,
  captureCustomPayment,
} = require("../Controller/customPaymentController");
const router = express.Router();

router.post("/create", createCustomOrder);
router.post("/create-paypal-order", createPayPalOrder);
router.post("/capture/:orderId", captureCustomPayment);

module.exports = router;
