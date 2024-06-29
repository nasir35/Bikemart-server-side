const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const authorization = require("../middleware/authorization");
const blogController = require("../controllers/blog.controller");
const router = express.Router();

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(verifyToken, authorization("admin"), blogController.saveBlog);
router
  .route("/:id")
  .patch(verifyToken, authorization("admin"), blogController.updateBlog)
  .delete(verifyToken, authorization("admin"), blogController.deleteBlog);

module.exports = router;
