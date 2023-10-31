const jwt = require("jsonwebtoken");
const User = require("../models/user");
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

    res
      .status(200)
      .set({
        token: token,
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

    res
      .status(201)
      .set({
        token: token,
      })
      .json({ message: "Account creation successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
};

module.exports = {
  login,
  register,
};
