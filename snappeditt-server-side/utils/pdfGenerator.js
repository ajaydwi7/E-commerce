const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateInvoice = (order, user) => {
  const doc = new PDFDocument({ margin: 50 });
  // Modify the invoicePath generation:
  const invoicePath = path.join(
    __dirname,
    "../invoices",
    `${order.invoiceNumber}.pdf`
  );

  if (!fs.existsSync(path.dirname(invoicePath))) {
    fs.mkdirSync(path.dirname(invoicePath), { recursive: true });
  }

  doc.pipe(fs.createWriteStream(invoicePath));

  // Add Logo (Increased Space Below)
  const logoPath = path.join(
    __dirname,
    "../../snappeditt/src/assets/images/SE-1.png"
  );
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 120 }); // Increased width for better visibility
  }

  // Add extra space after logo
  doc.moveDown(5);

  // Header
  doc.fontSize(20).text("INVOICE", { align: "center" }).moveDown(0.5);

  // Order Details
  doc
    .fontSize(12)
    .text(`Invoice #: ${order.invoiceNumber}`)
    .text(`Order ID: ${order.customOrderId}`)
    .text(`Order Date: ${order.createdAt.toLocaleDateString()}`)
    .moveDown();

  // Billing Info
  doc
    .fontSize(14)
    .text("Billing Information:", { underline: true })
    .moveDown(0.5)
    .fontSize(12)
    .text(`Name: ${order.billingDetails.name}`)
    .text(`Email: ${order.billingDetails.email}`)
    .text(`Address: ${order.billingDetails.address}`)
    .text(
      `${order.billingDetails.city}, ${order.billingDetails.state} ${order.billingDetails.zip}`
    )
    .moveDown();

  // Items Table
  const tableTop = doc.y;
  doc.font("Helvetica-Bold");
  doc.text("Description", 50, tableTop);
  doc.text("Price", 300, tableTop, { width: 100, align: "right" });
  doc.text("Qty", 400, tableTop, { width: 50, align: "right" });
  doc.text("Total", 450, tableTop, { width: 100, align: "right" });
  doc.font("Helvetica");

  let y = tableTop + 25;
  order.items.forEach((item, index) => {
    doc
      .text(item.serviceName, 50, y)
      .text(`$${item.finalPrice.toFixed(2)}`, 300, y, {
        width: 100,
        align: "right",
      })
      .text(item.quantity.toString(), 400, y, { width: 50, align: "right" })
      .text(`$${(item.finalPrice * item.quantity).toFixed(2)}`, 450, y, {
        width: 100,
        align: "right",
      });
    y += 20;
  });

  // Total
  doc
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke()
    .font("Helvetica-Bold")
    .text("Grand Total:", 300, y + 10, { width: 100, align: "right" })
    .text(`$${order.totalCost.toFixed(2)}`, 450, y + 10, {
      width: 100,
      align: "right",
    });

  doc.end();
  return invoicePath;
};
