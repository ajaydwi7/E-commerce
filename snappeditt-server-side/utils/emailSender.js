const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendOrderConfirmationEmail = async (email, order, invoicePath) => {
  const mailOptions = {
    from: `"SnappEditt" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Order Confirmation - #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d3748;">Thank you for your order!</h2>
        <p>Your order (#${
          order.customOrderId
        }) has been successfully placed on our Website. We shall verify your payment and process your order soon.</p>
        <h3 style="color: #2d3748;">Order Summary</h3>
        <p></p>
        <ul>
          ${order.items
            .map(
              (item) => `
            <li>
              ${item.serviceName} (Qty: ${item.quantity}) - 
              $${item.finalPrice.toFixed(2)}/each
            </li>
          `
            )
            .join("")}
        </ul>
        <p><strong>Total: $${order.totalCost.toFixed(2)}</strong></p>
        <p>Please feel free to connect us through support chat or email.</p>
        <p>Regards</p>
        <p>Team Snapp Editt</p>
        <p>Find your invoice attached to this email.</p>
      </div>
    `,
    attachments: [
      {
        filename: `#${order.invoiceNumber}.pdf`,
        path: invoicePath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

//Free trial Email Notification to User
exports.sendFreeTrialConfirmation = async (userEmail, freeTrialData) => {
  const mailOptions = {
    from: `"SnappEditt" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Free Trial Request Received - ${freeTrialData.orderName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for your free trial request!</h2>
        <p>We've received your request for <strong>${freeTrialData.service}</strong> and will respond shortly.</p>
        <h3>Request Details:</h3>
        <ul>
          <li>Order Name: ${freeTrialData.orderName}</li>
          <li>Images: ${freeTrialData.images}</li>
          <li>Description: ${freeTrialData.description}</li>
        </ul>
        <p>Best regards,<br/>SnappEditt Team</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

// emailSender.js
exports.sendCustomOrderConfirmation = async (email, order) => {
  const mailOptions = {
    from: `"SnappEditt" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Custom Order Confirmation - ${order.customOrderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d3748;">Thank you for your custom order!</h2>
        <p>Your order (${
          order.customOrderId
        }) has been successfully processed.</p>
        
        <h3 style="color: #2d3748;">Order Summary</h3>
        <ul>
          <li>Service Type: ${order.serviceType}</li>
          <li>Description: ${order.serviceDetails.description || "N/A"}</li>
          <li>Price: $${order.serviceDetails.price?.toFixed(2) || "0.00"}</li>
          <li>Status: ${order.payment.status}</li>
        </ul>
        
        <p>We will contact you regarding your "${
          order.orderDetails
        }" request shortly.</p>
        <p>Regards</p>
        <p>Team SnappEditt</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};
