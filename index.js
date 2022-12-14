const express = require("express");
const mongoose = require("mongoose");
const app = express();
var cors = require("cors");
var morgan = require("morgan");
const productsRoute = require("./src/routes/productsRoute");
const userRoute = require("./src/routes/userRoute");
const chatRoute = require("./src/routes/chatRoutes");

require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

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

app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "client/build", "index.html"));
});
// APIS

PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
