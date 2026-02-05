exports.buy = async (req, res) => {
  try {
    const { productId, buyerWallet, blockchainTxHash } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const order = await Order.create({
      productId: product._id,
      productCode: product.productCode,
      amountVND: product.priceVND,
      buyerWallet,
      blockchainTxHash,
    });

    res.json({
      msg: "Buy success",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Buy failed",
      error: err.message,
    });
  }
};
