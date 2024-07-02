const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const authorization = require("../middleware/authorization");
const orderController = require("../controllers/order.controller");
const router = express.Router();

router
  .route("/")
  .get(verifyToken, authorization("admin"), orderController.getAllOrders)
  .post(verifyToken, orderController.saveOrder);
router.route("/myorders").get(verifyToken, orderController.getMyOrders);
router.route("/myorder/:id").patch(verifyToken, orderController.updateMyOrder);

router
  .route("/:id")
  .get(verifyToken, orderController.getOrderDetails)
  .patch(verifyToken, authorization("admin"), orderController.updateOrder)
  .delete(verifyToken, authorization("admin"), orderController.deleteOrder);

module.exports = router;
