const express = require("express");
const reviewController = require("../controllers/review.controller");
const verifyToken = require("../middleware/verifyToken");
const authorization = require("../middleware/authorization");
const router = express.Router();

router
  .route("/")
  .get(verifyToken, authorization("admin"), reviewController.getAllReviews)
  .post(verifyToken, reviewController.saveReview);
router.route("/published").get(reviewController.getPublishedReviews);
router
  .route("/:id")
  .patch(verifyToken, authorization("admin"), reviewController.updateReview)
  .delete(verifyToken, authorization("admin"), reviewController.deleteReview);

module.exports = router;
