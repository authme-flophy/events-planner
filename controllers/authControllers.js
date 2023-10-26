const bcrypt = require("bcryptjs");
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

    const pwdMatch = await bcrypt.compare(password, user.password);

    if (!pwdMatch) {
      return res.status(400).json({ error: "Email or Password is incorrect" });
    }

    const payload = {
      user: {
        _id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_CODE, {
      expiresIn: 3600,
    });

    res
      .status(200)
      .set({
        token: token,
        expiresIn: 3600,
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

    // we are hashing the password to make sure it is stored in a hashed form
    const hashpwd = await bcrypt.hash(password, 12);

    user = new User({
      username,
      email,
      password: hashpwd,
    });

    const newUser = user.save();

    const payload = {
      user: {
        _id: newUser._id,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_CODE, {
      expiresIn: 3600,
    });

    res
      .status(201)
      .set({
        token: token,
        expiresIn: 3600,
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
