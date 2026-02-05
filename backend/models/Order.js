const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Order",
  new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    productCode: Number,          // 🔗 blockchain
    amountVND: Number,
    buyerWallet: String,
    blockchainTxHash: String,
    createdAt: { type: Date, default: Date.now }
  })
);
