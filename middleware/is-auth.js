const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/tokenBlacklist");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  TokenBlacklist.findOne({ authHeader }, (error, entry) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error checking token blacklist" });
    }

    if (entry) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decodedToken = jwt.verify(authHeader, process.env.SECRET_CODE);

      req.userId = decodedToken.user._id;

      next();
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  });
};
