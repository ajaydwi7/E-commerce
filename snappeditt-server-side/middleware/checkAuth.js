// check auth function to prevent unauthenticated users from accessing certain routes

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkAuth = (req, res, next) => {
  const token = req.cookies.userToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error("JWT Error:", err.message);
      return res.status(401).json({ error: "Invalid token" });
    }

    try {
      const user = await User.findById(decodedToken.id).select("-password");
      if (!user) return res.status(401).json({ error: "User not found" });

      req.user = user;
      next();
    } catch (error) {
      console.error("User lookup error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
};

module.exports = checkAuth;
