const express = require("express");
const authController = require("../Controller/authController");
const checkAuth = require("../middleware/checkAuth");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests
});

const router = express.Router();

// Auth Routes
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.userToken;

    if (!token) {
      return res.status(200).json({ user: null });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decodedToken.id)
      .select("-password")
      .lean();

    res.status(200).json(
      user
        ? {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address || {},
          }
        : { user: null }
    );
  } catch (error) {
    console.error("ME Endpoint Error:", error);
    res.status(200).json({ user: null });
  }
});

router.post("/logout", authController.logout);

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
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post(
  "/reset-password/:token",
  authLimiter,
  authController.resetPassword
);
router.post(
  "/change-password",
  checkAuth,
  authLimiter,
  authController.changePassword
);

module.exports = router;
