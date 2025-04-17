const mongoose = require("mongoose");

const FreeTrialSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  images: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  orderName: { type: String, required: true },
  imageLinks: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/.*)/.test(v); // Regex to validate URL
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  description: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["new", "Pending", "Processing", "Completed"],
    default: "new",
  },
  notes: [
    {
      text: String,
      createdAt: { type: Date, default: Date.now },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    },
  ],
});

module.exports = mongoose.model("FreeTrial", FreeTrialSchema);
