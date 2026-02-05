const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.controller");

router.post("/", controller.buy);

module.exports = router;
