const mongoose = require("mongoose");

const customOrderSchema = new mongoose.Schema({
  userDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    orderNumber: { type: String, required: true },
  },
  orderDetails: String,
  serviceType: { type: String, enum: ["existing", "new"], required: true },
  serviceDetails: {
    description: String,
    price: { type: Number, required: false },
    quantity: { type: Number, default: 1 },
  },
  payment: {
    paypalOrderId: { type: String, required: false },
    status: {
      type: String,
      enum: ["draft", "pending", "completed", "failed"],
      default: "draft",
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CustomOrder", customOrderSchema);
