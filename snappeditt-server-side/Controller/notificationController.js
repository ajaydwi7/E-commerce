// controllers/notificationController.js
const Notification = require("../models/Notification");

// Add to notificationController.js
exports.createNotification = async (
  adminId,
  type,
  message,
  relatedDocument = null,
  docModel = null
) => {
  try {
    console.log(`[DEBUG] Attempting to notify admin ${adminId}`);
    const notification = await Notification.create({
      admin: adminId,
      type,
      message,
      relatedDocument,
      docModel,
    });
    console.log(`[DEBUG] Notification created: ${notification._id}`);
    return notification;
  } catch (error) {
    console.error("Notification creation error:", error);
    console.error("[ERROR] Notification failed:", error.message);
    console.error("Stack trace:", error.stack); // Add this
    throw error;
  }
};

exports.getNotifications = async (req, res) => {
  try {
    if (!req.admin?._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const notifications = await Notification.find({ admin: req.admin._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    console.error("Notification fetch error:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, admin: req.admin._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { admin: req.admin._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
};
