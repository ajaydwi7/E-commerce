const mongoose = require("mongoose"); // Add this at the top
const ServiceOrder = require("../models/ServiceOrder");
const { client } = require("../helper/paypal");
const paypal = require("@paypal/checkout-server-sdk");
const Admin = require("../models/Admin");
const { createNotification } = require("./notificationController");
const Coupon = require("../models/Coupon");
const { generateInvoice } = require("../utils/pdfGenerator");
const { sendOrderConfirmationEmail } = require("../utils/emailSender");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// Confirm order
const confirmOrder = async (req, res) => {
  const {
    user_id,
    items,
    totalCost,
    paypalOrderId,
    paymentStatus,
    billingDetails,
    couponCode,
    discount,
  } = req.body;

  try {
    // Validate required fields
    const requiredFields = [user_id, items, totalCost, billingDetails];
    if (
      !user_id ||
      !items ||
      typeof totalCost === "undefined" ||
      !billingDetails
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Add conditional PayPal validation
    if (totalCost > 0) {
      try {
        // Verify with PayPal API
        const request = new paypal.orders.OrdersGetRequest(paypalOrderId);
        const response = await client.execute(request);

        if (response.result.status !== "COMPLETED") {
          return res.status(400).json({ error: "Payment not completed" });
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        return res.status(400).json({ error: "Payment verification failed" });
      }
    }

    if (totalCost === 0 && paypalOrderId) {
      return res
        .status(400)
        .json({ error: "PayPal ID not allowed for free orders" });
    }

    // Validate items structure
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid items format" });
    }

    // Validate each item
    for (const item of items) {
      if (!item.serviceId || !mongoose.isValidObjectId(item.serviceId)) {
        return res
          .status(400)
          .json({ error: `Invalid service ID: ${item.serviceId}` });
      }
      if (typeof item.basePrice !== "number" || isNaN(item.basePrice)) {
        return res.status(400).json({ error: "Invalid base price format" });
      }
    }
    // Add coupon validation logic
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (!coupon) return res.status(400).json({ error: "Invalid coupon" });
      if (coupon.expiryDate < new Date()) {
        return res.status(400).json({ error: "Coupon has expired" });
      }
      if (coupon.timesUsed >= coupon.maxUses) {
        return res.status(400).json({ error: "Coupon usage limit reached" });
      }

      // Validate cart total against minimum amount
      if (totalCost < coupon.minAmount) {
        return res.status(400).json({
          error: `Cart total must be at least $${coupon.minAmount} to use this coupon`,
        });
      }

      coupon.timesUsed += 1;
      await coupon.save();
    }
    // Create and save order
    const orderPayload = new ServiceOrder({
      user: user_id,
      totalCost,
      billingDetails,
      couponCode: couponCode || null,
      discountApplied: discount || 0,
      items: items.map((item) => ({
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        basePrice: item.basePrice,
        finalPrice: item.finalPrice ?? item.basePrice,
        quantity: item.quantity,
        featureImage: item.featureImage,
        selectedVariations: item.selectedVariations || [],
        formData: item.formData || {},
      })),
      status: "Pending",
      paymentStatus: totalCost > 0 ? "Completed" : "Pending",
    });
    // Only add paypalOrderId for paid orders
    if (totalCost > 0) {
      orderPayload.paypalOrderId = paypalOrderId;
    }

    const newOrder = new ServiceOrder(orderPayload);

    await newOrder.save();
    // Generate invoice
    const user = await User.findById(user_id);
    const invoicePath = await generateInvoice(newOrder, user);
    try {
      await sendOrderConfirmationEmail(user.email, newOrder, invoicePath);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }
    // Notify admins
    const admins = await Admin.find({
      roles: { $in: ["super-admin", "support", "editor"] },
      notificationPreferences: { $in: ["order"] },
    });

    await Promise.all(
      admins.map(async (admin) => {
        await createNotification(
          admin._id,
          "order",
          `New order placed ($${totalCost})`,
          newOrder._id,
          "ServiceOrder"
        );
      })
    );

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: {
        ...newOrder.toObject(),
        customOrderId: newOrder.customOrderId,
        paymentStatus: newOrder.paymentStatus,
        invoiceNumber: newOrder.invoiceNumber,
        invoiceUrl: newOrder.invoiceUrl,
      },
      // order: updatedOrder.toObject(),
    });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({
      error: "Order processing failed",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getOrderInvoice = async (req, res) => {
  try {
    const order = await ServiceOrder.findOne({
      invoiceNumber: req.params.invoiceNumber,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const invoicePath = path.join(
      __dirname,
      "../invoices",
      `${order.invoiceNumber}.pdf`
    );

    if (!fs.existsSync(invoicePath)) {
      console.log(`PDF file missing: ${invoicePath}`);
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${order.invoiceNumber}.pdf`
    );

    fs.createReadStream(invoicePath).pipe(res);
  } catch (error) {
    console.error("Invoice error:", error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
};

// Fetch all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      ServiceOrder.find()
        .sort({ createdAt: -1 }) // Add this line for descending order
        .skip(skip)
        .limit(limit),
      ServiceOrder.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Fetch orders by user ID
const getOrdersByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      ServiceOrder.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ServiceOrder.countDocuments({ user: req.params.userId }),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

// Cancel order
// Modify cancelOrder controller
const cancelOrder = async (req, res) => {
  try {
    const order = await ServiceOrder.findByIdAndUpdate(
      req.body.orderId,
      {
        status: "Cancelled",
        order_cancelled: true,
        percentage_complete: 0,
        cancellation_date: new Date(),
      },
      { new: true } // Return updated document
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    // Notify admins
    const admins = await Admin.find({
      roles: { $in: ["super-admin", "support"] },
    });

    await Promise.all(
      admins.map(async (admin) => {
        await createNotification(
          admin._id,
          "order",
          `Order cancelled: ${order._id}`,
          order._id,
          "ServiceOrder"
        );
      })
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: order.toObject(), // Convert to plain object
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};

// Fetch order by ID
const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      return res.status(400).json({ error: "Invalid order ID format" });
    }
    const order = await ServiceOrder.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

module.exports = {
  confirmOrder,
  getAllOrders,
  getOrdersByUser,
  cancelOrder,
  getOrderById,
  getOrderInvoice,
};
