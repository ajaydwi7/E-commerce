const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceOrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
          optionId: Schema.Types.ObjectId,
          optionName: String,
          optionDescription: String,
        },
      ],
      formData: {
        type: Object,
      },
    },
  ],
  totalCost: {
    type: Number,
    required: true,
    min: 0,
  },

  billingDetails: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  // Add to ServiceOrderSchema
  couponCode: {
    type: String,
    default: null,
  },
  discountApplied: {
    type: Number,
    default: 0,
    min: 0,
  },
  paypalOrderId: {
    type: String,
    required: function () {
      return this.totalCost > 0;
    },
    index: {
      unique: true,
      sparse: true, // Allow multiple null values
    },
  },
  status: {
    type: String,
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Refunded"],
    default: "Pending",
    required: true,
  },
  invoiceUrl: {
    type: String,
    required: true,
  },
  order_cancelled: {
    type: Boolean,
    default: false,
  },
  cancellation_date: {
    type: Date,
  },
  percentage_complete: {
    type: Number,
    default: 0,
  },
  expected_delivery_date: {
    type: Date,
    default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ServiceOrder", ServiceOrderSchema);
