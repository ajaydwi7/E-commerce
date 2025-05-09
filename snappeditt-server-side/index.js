require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const routes = require("./routes/apis");
const setupRefundRetries = require("./utils/refundRetry");
const paymentRoutes = require("./routes/paymentRoutes");
const cartRoutes = require("./routes/cartRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const freeTrialRoutes = require("./routes/freeTrialRoutes");
const adminRoutes = require("./routes/admin");
const couponRoutes = require("./routes/couponRoutes");
const customPaymentRoutes = require("./routes/customPaymentRoutes");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const uri = process.env.MONGO_DB_URI;
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const _dirname = path.resolve();

console.log("PORT:", process.env.PORT);
app.use(cookieParser());

app.use(helmet());
// connect to mongodb

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    setupRefundRetries();
  })
  .catch((err) => console.error("Connection error:", err));

const ensureUploadsDir = () => {
  const dir = "./uploads";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureUploadsDir();
// Add this before your route definitions
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const allowedOrigins = [
  // Frontend dev server
  "http://localhost:3000",
  "http://localhost:5173", // Backend in development
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization, Idempotency-Key",
  })
);

app.use(bodyParser.json());

// Middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
  app.use(express.static(path.join(_dirname, "/snappeditt/dist")));
  app.use(express.static(path.join(_dirname, "/snappeditt/dist")));
}

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api", routes, contactRoutes, freeTrialRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/paypal", paymentRoutes);
app.use("/api/custom-payment", customPaymentRoutes);
app.use("/api/coupons", couponRoutes);

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path);
  }
});

// error handling middleware
if (isProduction) {
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(_dirname, "snappeditt", "dist", "index.html"));
  });
} else {
  console.log("Development Mode: Frontend runs on http://localhost:5173");
}

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
