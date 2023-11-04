const express = require("express");
const authControllers = require("../controllers/authControllers");
const router = express.Router();

router.post("/login", authControllers.login);

router.post("/register", authControllers.register);

router.post("/refresh-token", authControllers.refresh_token);

router.post("/forgot-password", authControllers.forgotPassword);

router.post("/reset-password/:resetToken", authControllers.resetPassword);

router.post("/logout", authControllers.logout);

module.exports = router;
