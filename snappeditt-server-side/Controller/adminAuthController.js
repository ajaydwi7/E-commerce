// controllers/adminAuthController.js
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/emailSender");

const createAdminToken = (id) => {
  return jwt.sign({ id }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!admin.isActive) {
      return res.status(403).json({ error: "Account deactivated" });
    }

    const token = createAdminToken(admin._id);
    admin.lastLogin = new Date();
    await admin.save();

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust for dev
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      id: admin._id,
      role: admin.role,
      fullName: admin.fullName,
      email: admin.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.adminSignup = async (req, res) => {
  const { fullName, email, password } = req.body; // Remove role from destructuring

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const admin = await Admin.create({
      fullName,
      email,
      password,
      role: "admin", // Force default role
      isActive: true,
    });

    res.status(201).json({
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.adminLogout = (req, res) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
// In adminAuthController.js - improve error messages
exports.checkAdminAuth = async (req, res) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        error: "No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        authenticated: false,
        error: "Admin not found",
      });
    }

    res.status(200).json({
      authenticated: true,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(401).json({
      authenticated: false,
      error: error.message || "Invalid token",
    });
  }
};

exports.adminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    admin.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    admin.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    await admin.save();

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/admin/reset-password/${resetToken}`;

    await sendEmail({
      email: admin.email,
      subject: "Password Reset Request (Valid for 10 mins)",
      html: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}`,
    });

    res.status(200).json({ message: "Reset token sent to email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adminResetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const admin = await Admin.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ error: "Token is invalid or has expired" });
    }

    admin.password = req.body.password;
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
