const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);

    console.log("database connected 👍");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
