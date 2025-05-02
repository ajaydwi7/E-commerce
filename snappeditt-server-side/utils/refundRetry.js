const cron = require("node-cron");
const { client } = require("../helper/paypal");
const paypal = require("@paypal/checkout-server-sdk");
const ServiceOrder = require("../models/ServiceOrder");

const setupRefundRetries = () => {
  cron.schedule("0 */6 * * *", async () => {
    const failedRefunds = await ServiceOrder.find({
      paymentStatus: "Failed",
      refundAttempts: { $lt: 3 },
    });

    for (const order of failedRefunds) {
      try {
        const refundRequest = new paypal.payments.CapturesRefundRequest(
          order.captureId
        );
        const response = await client.execute(refundRequest);

        order.paymentStatus =
          response.result.status === "COMPLETED" ? "Refunded" : "Failed";
        order.refundAttempts += 1;
        order.lastRefundAttempt = new Date();
        await order.save();
      } catch (error) {
        console.error(`Refund retry failed for order ${order._id}:`, error);
        order.refundAttempts += 1;
        order.lastRefundAttempt = new Date();
        await order.save();
      }
    }
  });
};

module.exports = setupRefundRetries;
