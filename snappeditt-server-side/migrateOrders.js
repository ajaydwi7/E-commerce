const mongoose = require("mongoose");
const ServiceOrder = require("./models/ServiceOrder");
const Counter = require("./models/Counter");

const mongoURI =
  "mongodb+srv://ajaydwi7:Raja%23dwi7@cluster0.zy0by.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function migrateOrderNumbers() {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Initialize counter
  const counter = await Counter.findOneAndUpdate(
    { _id: "orderId" },
    { $setOnInsert: { seq: 1000 } },
    { new: true, upsert: true }
  );

  // Get orders without customOrderId
  const orders = await ServiceOrder.find({
    customOrderId: { $exists: false },
  }).sort({ createdAt: 1 });

  let sequence = counter.seq;
  for (const order of orders) {
    sequence++;

    // Add temporary values for required fields
    if (!order.invoiceUrl) {
      order.invoiceUrl = `temp-invoice-${sequence}`;
    }

    // Ensure billingDetails.country exists
    if (order.billingDetails && !order.billingDetails.country) {
      order.billingDetails.country = "Unknown";
    }

    // Save without validation
    await order.save({ validateBeforeSave: false });
  }

  // Update counter
  await Counter.findByIdAndUpdate("orderId", { seq: sequence });
  console.log(`Migrated ${orders.length} orders`);
  process.exit();
}

migrateOrderNumbers().catch(console.error);
