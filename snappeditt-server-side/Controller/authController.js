const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { createNotification } = require("./notificationController");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      // Check for existing email first
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const user = await User.create({
        firstName,
        lastName,
        phone,
        email,
        password,
        address: {},
      });
      const token = createToken(user._id);
      res.cookie("userToken", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });
      // Notify admins
      const admins = await Admin.find({
        roles: { $in: ["super-admin", "support"] },
      });

      await Promise.all(
        admins.map(async (admin) => {
          await createNotification(
            admin._id,
            "user",
            `New user registered: ${user.email}`,
            user._id,
            "User"
          );
        })
      );
      res.status(201).json({
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } catch (error) {
      // Handle MongoDB duplicate error
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already registered" });
      }
      res.status(400).json({ error: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie("userToken", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });
      res.status(200).json({
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(404).json({
        error: error.message,
      });
    }
  },
  logout: async (req, res) => {
    try {
      res.cookie("userToken", "", { maxAge: 1 });
      res.status(200).json({ message: "User Logged Out" });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Add to authController
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
      await user.save();

      // In production: Send email with reset link
      console.log(
        `Password reset link: http://localhost:5173/reset-password/${resetToken}`
      );

      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });

      if (!user)
        return res.status(400).json({ error: "Invalid or expired token" });

      user.password = password;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!validPassword)
        return res.status(400).json({ error: "Current password is incorrect" });

      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;
