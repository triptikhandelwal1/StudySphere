const jwt = require("jsonwebtoken");

const JWT_SECRET = "studysphere_secret";

function authMiddleware(req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    const token = authHeader.split(" ")[1];
const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;