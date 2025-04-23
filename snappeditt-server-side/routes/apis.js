const express = require("express");
const authController = require("../Controller/authController");
const checkAuth = require("../middleware/checkAuth");
const User = require("../models/User");

const router = express.Router();

// Auth Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
// Add this route to your backend API routes
router.get("/users", checkAuth, (req, res, next) => {
  User.find({})
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json({ error: "Failed to fetch users" }));
});
router.get("/users/:id", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user data" });
  }
});

router.put("/users/:id", checkAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      ...user._doc,
      address: user.address || {},
    });
  } catch (err) {
    res.status(500).json({ error: "Error updating user data" });
  }
});

// Password reset routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/change-password", checkAuth, authController.changePassword);

module.exports = router;
