const express = require("express");
const {
  createCustomOrder,
  createPayPalOrder,
  captureCustomPayment,
  getAllCustomOrders,
  getCustomOrderById,
  updateCustomOrderStatus,
  deleteCustomOrder,
} = require("../Controller/customPaymentController");
const router = express.Router();

router.post("/create", createCustomOrder);
router.post("/create-paypal-order", createPayPalOrder);
router.post("/capture/:orderId", captureCustomPayment);
// Add these routes to your customPaymentRoutes.js file
router.get("/all", getAllCustomOrders);
router.get("/:id", getCustomOrderById);
router.put("/:id/status", updateCustomOrderStatus);
router.delete("/:id", deleteCustomOrder);

module.exports = router;
