// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminAuthController = require("../Controller/adminAuthController");
const adminController = require("../Controller/adminController");
const notificationController = require("../Controller/notificationController");
const { protect, restrictTo } = require("../middleware/adminAuth");
const User = require("../models/User");

// Authentication
router.post("/login", adminAuthController.adminLogin);
router.post("/signup", adminAuthController.adminSignup);
router.post("/logout", adminAuthController.adminLogout);
router.get("/check-auth", adminAuthController.checkAdminAuth);

// Protected routes
router.use(protect);

// Profile Management
router.get("/profile", adminController.getAdminProfile);
router.put("/profile", adminController.updateAdminProfile);
router.patch("/profile/password", adminController.changePassword);
router.post("/forgot-password", adminAuthController.adminForgotPassword);
router.post("/reset-password/:token", adminAuthController.adminResetPassword);
// Admin Management
router
  .route("/admins/:adminId")
  .put(restrictTo("super-admin"), adminController.updateAdmin)
  .delete(restrictTo("super-admin"), adminController.deleteAdmin);

// Admin Management (super-admin only)
router
  .route("/admins")
  .post(restrictTo("super-admin"), adminController.createAdmin)
  .get(restrictTo("super-admin"), adminController.getAllAdmins);
// Add to admin.js routes

// Order Status Management
router.patch(
  "/orders/:orderId/status",
  restrictTo("super-admin", "admin", "support"),
  adminController.updateOrderStatus
);

// User Management
router.delete(
  "/users/:userId",
  restrictTo("super-admin", "admin"),
  adminController.deleteUser
);

// Admin user management routes
router.get(
  "/users",
  protect,
  restrictTo("admin", "super-admin", "support"),
  adminController.getAllUsers
);

router.get(
  "/users/:id",
  restrictTo("admin", "super-admin", "support"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Error fetching user data" });
    }
  }
);

// Order Management
router.delete(
  "/orders/:orderId",
  restrictTo("super-admin", "admin"),
  adminController.deleteOrder
);

router.put(
  "/orders/:orderId",
  restrictTo("super-admin", "admin"),
  adminController.updateOrder
);

// Notification Routes
router.get("/notifications", protect, notificationController.getNotifications);

router.patch(
  "/notifications/:notificationId/read",
  protect,
  notificationController.markNotificationAsRead
);

router.patch(
  "/notifications/read-all",
  protect,
  notificationController.markAllNotificationsAsRead
);

//contact form admin routes
router.get("/contact/forms", protect, adminController.getAllContactForms);
router.get(
  "/contact/forms/:formId",
  protect,
  adminController.getContactFormById
);
router.put(
  "/contact/forms/:formId/status",
  protect,
  restrictTo("admin", "super-admin"),
  adminController.updateContactFormStatus
);
router.delete(
  "/contact/forms/:formId",
  protect,
  restrictTo("super-admin", "admin"),
  adminController.deleteContactForm
);
router.post(
  "/contact/forms/:formId/notes",
  protect,
  restrictTo("admin", "super-admin"),
  adminController.addNoteToContactForm
);

// Free Trial Admin Routes
router.get("/free-trial", protect, adminController.getAllFreeTrials);
router.get("/free-trial/:trialId", protect, adminController.getFreeTrialById);
router.put(
  "/free-trial/:trialId/status",
  protect,
  restrictTo("admin", "super-admin"),
  adminController.updateFreeTrialStatus
);
router.delete(
  "/free-trial/:trialId",
  protect,
  restrictTo("super-admin", "admin"),
  adminController.deleteFreeTrial
);
router.post(
  "/free-trial/:trialId/notes",
  protect,
  restrictTo("admin", "super-admin"),
  adminController.addNoteToFreeTrial
);
module.exports = router;
