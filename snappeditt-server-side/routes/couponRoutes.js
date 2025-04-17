const express = require("express");
const router = express.Router();
const {
  validateCoupon,
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  updateCoupon,
} = require("../Controller/couponController");
const { protect, restrictTo } = require("../middleware/adminAuth");

// Public routes
router.post("/validate", validateCoupon);

// // Admin routes
router.use(protect);
router.post("/", restrictTo("super-admin", "admin"), createCoupon);
router.get("/", restrictTo("super-admin", "admin", "support"), getAllCoupons);
// Add these routes under admin routes section
router.delete("/:id", restrictTo("super-admin", "admin"), deleteCoupon);
router.put("/:id", restrictTo("super-admin", "admin"), updateCoupon);
module.exports = router;
