const express = require("express");
const router = express.Router();
const cartController = require("../Controller/cartController");
const checkAuth = require("../middleware/checkAuth");

// Protected routes
router.use(checkAuth);

// Updated routes
router.post("/add", cartController.addToCart);
router.get("/", cartController.getCart);
router.delete("/remove", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);
router.put("/update", cartController.updateCartQuantity);

module.exports = router;
