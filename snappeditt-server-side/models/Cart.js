const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
      serviceName: {
        type: String,
        required: true,
      },
      basePrice: {
        type: Number,
        required: true,
      },
      finalPrice: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      featureImage: {
        type: String,
      },
      selectedVariations: [
        {
          variationType: String,
          optionId: mongoose.Schema.Types.ObjectId,
          optionName: String,
        },
      ],
      formData: {
        type: Object,
      },
    },
  ],
  cartTotal: {
    type: Number,
    default: 0,
    required: true,
  },
  cartQuantity: {
    type: Number,
    default: 0,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
