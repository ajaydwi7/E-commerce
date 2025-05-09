const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 }, // Start from 1000 or any number you prefer
});

module.exports = mongoose.model("Counter", CounterSchema);
