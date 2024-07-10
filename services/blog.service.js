const Blog = require("../models/Blog");

exports.findAllBlogService = async () => {
  try {
    const blogs = await Blog.find().exec();
    return blogs;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.AllBlogCountService = async () => {
  try {
    const blogsCount = await Blog.countDocuments().exec();
    return blogsCount;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.saveBlogService = async (data) => {
  const result = await Blog.create(data);
  return result;
};
exports.modifyBlogService = async (id, update) => {
  try {
    const isExist = await Blog.findById(id);
    if (isExist) {
      const result = await Blog.findOneAndUpdate({ _id: id }, update, {
        upsert: true,
        new: true,
      });
      return result;
    } else {
      throw new Error("No blog found with the specified ID.");
    }
  } catch (error) {
    throw error;
  }
};
exports.deleteBlogService = async (id) => {
  const result = await Blog.findOneAndDelete({ _id: id });
  return result;
};
exports.findBlogService = async (id) => {
  const result = await Blog.findById(id);
  return result;
};
