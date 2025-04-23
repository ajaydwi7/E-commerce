const mongoose = require("mongoose");

const InvoiceCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 },
  year: { type: Number, default: new Date().getFullYear() },
});

module.exports = mongoose.model("InvoiceCounter", InvoiceCounterSchema);
