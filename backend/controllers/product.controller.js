const Product = require("../models/Product");

exports.getAll = async (req, res) => {
  res.json(await Product.find());
};

exports.create = async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
};
