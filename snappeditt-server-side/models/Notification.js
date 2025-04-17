const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["order", "user", "contact", "trial", "system"],
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedDocument: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "docModel",
    },
    docModel: {
      type: String,
      enum: ["ServiceOrder", "User", "ContactForm", "FreeTrial"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
