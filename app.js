const express = require("express");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth");
const eventRouter = require("./routes/events");

const app = express();

connectDB();
app.listen(4000, console.log("server running 😃"));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<p>set up successfully</p>");
});

app.use("/auth", authRouter);
app.use("/events", eventRouter);

app.use((req, res) => {
  res.status(404).send("<p> page not found </p>");
});
