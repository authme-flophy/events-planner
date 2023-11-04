const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const transporter = require("../config/mail");
const TokenBlacklist = require("../models/tokenBlacklist");
require("dotenv").config();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Email or Password is incorrect" });
    }

    const pwdMatch = await user.matchPasswords(password);

    if (!pwdMatch) {
      return res.status(400).json({ error: "Email or Password is incorrect" });
    }

    const token = user.getToken();
    const refresh_token = user.getRefreshToken();
    console.log(token);

    res
      .status(200)
      .set({
        token: token,
        refresh_token: refresh_token,
      })
      .json({ message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
};

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // checking whether there is a user with the email used in the db
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ error: "An account associated with that email exists" });
    }

    user = new User({
      username,
      email,
      password,
    });

    await user.save();

    const token = user.getToken();
    const refresh_token = user.getRefreshToken();

    res
      .status(201)
      .set({
        token: token,
        refresh_token: refresh_token,
      })
      .json({ message: "Account creation successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
};

const refresh_token = async (req, res) => {
  let refresh_token = req.headers.refresh_token;

  try {
    if (!refresh_token) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    jwt.verify(
      refresh_token,
      process.env.REFRESH_SECRET_CODE,
      async (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Invalid refresh token" });
        }

        user = await User.findOne({ _id: user.id });

        if (!user) {
          return res.status(403).json({ error: "Invalid refresh token" });
        }

        const token = user.getToken();
        refresh_token = user.getRefreshToken();

        console.log(token);
        console.log(refresh_token);

        res
          .status(201)
          .set({
            token: token,
            refresh_token: refresh_token,
          })
          .json({ message: "new token" });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
};

const forgotPassword = async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "Email could not be sent" });
    }

    const resetToken = user.forgotPasswordToken();

    await user.save();

    const resetLink = `http://localhost:4000/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: "Event-planner password reset request",
      html: `
        <h1>Reset password instructions</h1>
        <p>Follow the link to reset your password: <a href="${resetLink}" target="_blank">reset password</a></p>
        
        <p><b>This link expires 15 minutes after the reset password request</b></p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Error sending email" });
      }
      res.status(201).json({ message: "Password reset email sent" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
};

const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    user.password = req.body.newPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(201).json({ message: "Password reset successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
};

const logout = async (req, res) => {
  const token = req.token;
  const userId = req.userId;

  try {
    const blacklistEntry = new TokenBlacklist({
      userId,
      token,
    });
    await blacklistEntry.save();

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "server error" });
  }
};

module.exports = {
  login,
  register,
  refresh_token,
  forgotPassword,
  resetPassword,
  logout,
};
