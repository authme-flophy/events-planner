const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/tokenBlacklist");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const entry = await TokenBlacklist.findOne({ token });
    console.log(entry);

    if (entry) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_CODE);

    console.log(decodedToken);

    req.userId = decodedToken.id;
    req.token = token;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({ error: "Unauthorized" });
  }
};
