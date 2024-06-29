const {
  AllBlogCountService,
  findAllBlogService,
  saveBlogService,
  modifyBlogService,
  deleteBlogService,
} = require("../services/blog.service");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await findAllBlogService();
    const totalCount = await AllBlogCountService();
    res.status(200).json({
      status: "success",
      totalCount,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
exports.saveBlog = async (req, res) => {
  try {
    const blog = req.body;
    const result = await saveBlogService(blog);

    res.status(200).json({
      status: "success",
      data: result,
      message: "Blog Added successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
exports.updateBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const result = await modifyBlogService(id, update);

    res.status(200).json({
      status: "success",
      data: result,
      message: "Blog modified successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error?.message || error,
    });
  }
};
exports.deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteBlogService(id);

    if (result === null) {
      res.status(404).json({
        status: "fail",
        message: "No Blog found with this ID.",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: result,
        message: "Blog deleted successfully!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
