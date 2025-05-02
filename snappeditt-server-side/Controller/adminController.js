// controllers/adminController.js
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const ServiceOrder = require("../models/ServiceOrder");
const ContactForm = require("../models/ContactForm");
const FreeTrial = require("../models/freeTrial");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

// Admin Management
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;
    const admin = await Admin.create({ email, password, fullName, role });
    res.status(201).json({
      id: admin._id,
      email: admin.email,
      role: admin.role,
      fullName: admin.fullName,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      Admin.find().select("-password").skip(skip).limit(limit),
      Admin.countDocuments(),
    ]);

    res.json({
      admins,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;
    // Validate order ID format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid order ID format" });
    }

    // Validate at least one status is provided
    if (!status && !paymentStatus) {
      return res.status(400).json({ error: "No update parameters provided" });
    }
    const validOrderStatuses = [
      "Pending",
      "Processing",
      "Completed",
      "Cancelled",
    ];
    const validPaymentStatuses = ["Pending", "Completed", "Failed"];

    const updates = {};
    if (status && validOrderStatuses.includes(status)) updates.status = status;
    if (paymentStatus && validPaymentStatuses.includes(paymentStatus)) {
      updates.paymentStatus = paymentStatus;
    }

    const order = await ServiceOrder.findByIdAndUpdate(orderId, updates, {
      new: true,
      runValidators: true,
    }).populate("user", "username email");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
    details: process.env.NODE_ENV === "development" ? error.message : undefined;
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        error: "User not found",
      });
    }

    // Delete associated orders
    await ServiceOrder.deleteMany({ user: req.params.userId }).catch((err) =>
      console.error("Error deleting orders:", err)
    );

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await ServiceOrder.findByIdAndDelete(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Optional: Delete associated invoice file
    const invoicePath = path.join(
      __dirname,
      "../invoices",
      `invoice-${order._id}.pdf`
    );
    if (fs.existsSync(invoicePath)) {
      fs.unlinkSync(invoicePath);
    }

    res.status(204).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await ServiceOrder.findByIdAndUpdate(
      req.params.orderId,
      req.body,
      { new: true, runValidators: true }
    ).populate("user", "username email");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Profile Management
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { fullName, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    const { currentPassword, newPassword } = req.body;

    if (!(await admin.matchPassword(currentPassword))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin Management (Super-Admin only)
exports.updateAdmin = async (req, res) => {
  try {
    const { role, isActive, fullName, email } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.params.adminId,
      { role, isActive, fullName, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!admin) return res.status(404).json({ error: "Admin not found" });

    res.json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.adminId);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Contact Form Management
exports.getAllContactForms = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filters
    const filters = {};

    // Status filter
    if (req.query.status) {
      filters.status = req.query.status;
    }

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filters.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { topic: searchRegex },
      ];
    }

    // Date filtering
    if (req.query.dateRange) {
      const now = new Date();
      switch (req.query.dateRange) {
        case "today":
          filters.createdAt = { $gte: new Date().setHours(0, 0, 0, 0) };
          break;
        case "week":
          filters.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
          break;
        case "month":
          filters.createdAt = {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          };
          break;
      }
    }

    const [contactForms, total] = await Promise.all([
      ContactForm.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactForm.countDocuments(filters),
    ]);

    res.json({
      forms: contactForms,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalCount: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getContactFormById = async (req, res) => {
  try {
    const form = await ContactForm.findById(req.params.formId);
    if (!form) return res.status(404).json({ error: "Contact form not found" });
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateContactFormStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const form = await ContactForm.findByIdAndUpdate(
      req.params.formId,
      { status },
      { new: true }
    );
    if (!form) return res.status(404).json({ error: "Contact form not found" });
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteContactForm = async (req, res) => {
  try {
    const form = await ContactForm.findByIdAndDelete(req.params.formId);
    if (!form) return res.status(404).json({ error: "Contact form not found" });
    res.json({ message: "Contact form deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addNoteToContactForm = async (req, res) => {
  try {
    const { note } = req.body;
    const form = await ContactForm.findById(req.params.formId);
    if (!form) return res.status(404).json({ error: "Contact form not found" });
    form.notes.push({ note, createdBy: req.admin._id });
    await form.save();
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Free Trial Management
exports.getAllFreeTrials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build filters
    const filters = {};

    // Status filter
    if (req.query.status && req.query.status !== "all") {
      filters.status = req.query.status;
    }

    // Service filter
    if (req.query.service && req.query.service !== "all") {
      filters.service = req.query.service;
    }

    // Date filtering
    if (req.query.dateRange && req.query.dateRange !== "all") {
      const now = new Date();
      switch (req.query.dateRange) {
        case "today":
          filters.createdAt = { $gte: new Date().setHours(0, 0, 0, 0) };
          break;
        case "week":
          filters.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
          break;
        case "month":
          filters.createdAt = {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          };
          break;
      }
    }

    const [trials, total] = await Promise.all([
      FreeTrial.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
      FreeTrial.countDocuments(filters),
    ]);

    res.json({
      trials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFreeTrialById = async (req, res) => {
  try {
    const trial = await FreeTrial.findById(req.params.trialId);
    if (!trial) return res.status(404).json({ error: "Free trial not found" });
    res.json(trial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFreeTrialStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const trial = await FreeTrial.findByIdAndUpdate(
      req.params.trialId,
      { status },
      { new: true }
    );
    if (!trial) return res.status(404).json({ error: "Free trial not found" });
    res.json(trial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFreeTrial = async (req, res) => {
  try {
    const trial = await FreeTrial.findByIdAndDelete(req.params.trialId);
    if (!trial) return res.status(404).json({ error: "Free trial not found" });
    res.json({ message: "Free trial deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addNoteToFreeTrial = async (req, res) => {
  try {
    const { note } = req.body;
    const trial = await FreeTrial.findById(req.params.trialId);
    if (!trial) return res.status(404).json({ error: "Free trial not found" });
    trial.notes.push({ note, createdBy: req.admin._id });
    await trial.save();
    res.json(trial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filters
    const filters = {};

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filters.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      User.find(filters)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filters),
    ]);

    res.json({
      users,
      pagination: {
        totalUsers: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: "Failed to fetch users",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
