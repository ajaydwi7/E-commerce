// check auth function to prevent unauthenticated users from accessing certain routes

const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  const token = req.cookies.userToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.error("JWT Verify Error:", err);
      return res.status(401).json({ error: "Invalid token" });
    }

    if (!decodedToken?.id) {
      return res.status(401).json({ error: "Malformed token" });
    }

    req.user = { id: decodedToken.id };
    next();
  });
};

module.exports = checkAuth;
