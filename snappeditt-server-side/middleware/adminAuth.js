// Updated middleware/adminAuth.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.protect = async (req, res, next) => {
  let token;

  // 1. Check for cookie in multiple locations
  token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token found in cookies or headers");
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    // 2. Verify JWT with proper error handling
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    // 3. Check if admin exists and is active
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      console.log(`Admin not found for ID: ${decoded.id}`);
      return res.status(401).json({ error: "Not authorized" });
    }

    if (!admin.isActive) {
      console.log(`Admin account inactive for: ${admin.email}`);
      return res.status(403).json({ error: "Account deactivated" });
    }

    // 4. Attach admin to request
    req.admin = admin;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    // Specific error messages
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.status(401).json({ error: "Authorization failed" });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      console.log(`Role violation: ${req.admin.role} tried to access ${roles}`);
      return res.status(403).json({
        error: `Access restricted to: ${roles.join(", ")}`,
      });
    }
    next();
  };
};
