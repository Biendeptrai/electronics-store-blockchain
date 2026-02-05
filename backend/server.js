require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));


app.use("/api/products", require("./routes/product.route"));
app.use("/api/orders", require("./routes/order.route"));

app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
