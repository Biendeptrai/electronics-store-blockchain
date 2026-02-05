const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productCode: {
    type: Number,
    required: true,
    unique: true
  },
  name: String,
  priceVND: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", ProductSchema);
