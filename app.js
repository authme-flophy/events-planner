const express = require("express");
const connectDB = require("./config/db");

const app = express();

app.listen(4000);

connectDB();

app.get("/", (req, res) => {
  res.send("<p>set up successfully</p>");
});

app.use((req, res) => {
  res.status(404).send("<p> page not found </p>");
});
