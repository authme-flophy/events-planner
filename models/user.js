const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_CODE, {
    expiresIn: process.env.EXPIRY,
  });
};

userSchema.methods.getRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_SECRET_CODE, {
    expiresIn: process.env.REFRESH_EXPIRY,
  });
};

module.exports = mongoose.model("User", userSchema);
