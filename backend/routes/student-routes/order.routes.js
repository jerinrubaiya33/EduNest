const express = require("express");
const auth = require("../../middleware/auth");
const {
  createOrder,
  confirmOrderPayment,
  getMyOrders,
  getOrderDetails,
} = require("../../controller/student-controller/order.controller");

const router = express.Router();

router.post("/", auth, createOrder);
router.patch("/:orderId/confirm", auth, confirmOrderPayment);
router.get("/", auth, getMyOrders);
router.get("/:orderId", auth, getOrderDetails);

module.exports = router;
