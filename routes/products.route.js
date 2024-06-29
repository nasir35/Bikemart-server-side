const express = require("express");
const productController = require("../controllers/product.controller");
const verifyToken = require("../middleware/verifyToken");
const authorization = require("../middleware/authorization");
const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(verifyToken, authorization("admin"), productController.saveProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(verifyToken, authorization("admin"), productController.updateProduct)
  .delete(verifyToken, authorization("admin"), productController.deleteProduct);

module.exports = router;
