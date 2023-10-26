const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(authHeader, process.env.SECRET_CODE);

    req.userId = decodedToken.user._id;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
