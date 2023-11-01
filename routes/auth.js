const express = require("express");
const authControllers = require("../controllers/authControllers");
const router = express.Router();

router.post("/login", authControllers.login);

router.post("/register", authControllers.register);

router.post("/refresh-token", authControllers.refresh_token);

// router.get("/:id", (req, res) => {});
// router.delete("/:id", (req, res) => {});
// router.put("/:id", (req, res) => {});

module.exports = router;
