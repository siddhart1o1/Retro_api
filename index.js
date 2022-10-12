const express = require("express");
const mongoose = require("mongoose");
const app = express();
const productsRoute = require("./src/routes/productsRoute");
const userRoute = require("./src/routes/userRoute");
const chatRoute = require("./src/routes/chatRoutes");
require("dotenv").config();

var cors = require("cors");
var morgan = require("morgan");
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

// APIS
app.get("/", (req, res) => {
  res.send("RETRO APIS");
});

// routes -----------------------------
app.use("/api/products", productsRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
// routes -----------------------------

app.get("*", function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});
// APIS

PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
