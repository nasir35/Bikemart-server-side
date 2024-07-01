const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");
const authorization = require("../middleware/authorization");
const router = express.Router();

router.get("/", userController.getAllUsers);
router.post("/signup", userController.signup);
router.get("/signup/confirmation/:token", userController.confirmEmail);
router.get(
  "/signup/resend-verification/:email",
  userController.resendVerificationLink
);
router.get("/signup/token-expiry/:email", userController.getTokenExpiry);

router.post("/login", userController.login);

router.get("/me", verifyToken, userController.getMe);
router
  .route("/:email")
  .get(userController.getUserByEmail)
  .delete(verifyToken, authorization("admin"), userController.deleteUser);

module.exports = router;
