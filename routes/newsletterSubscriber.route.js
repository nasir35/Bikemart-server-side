const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const authorization = require("../middleware/authorization");
const router = express.Router();
const newsletterSubscriberController = require("../controllers/newsletterSubscriber.controller");

router
  .route("/")
  .get(
    verifyToken,
    authorization("admin"),
    newsletterSubscriberController.getAllSubscriber
  )
  .post(newsletterSubscriberController.createSubscriber);
router.route("/:email").patch(newsletterSubscriberController.removeSubscriber);

module.exports = router;
