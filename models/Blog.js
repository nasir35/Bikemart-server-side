const mongoose = require("mongoose");
const validator = require("validator");

const blogSchema = mongoose.Schema(
  {
    author: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: [true, "Please provide a name."],
        trim: true,
        minLength: [2, "Name must be at least 2 characters."],
        maxLength: [50, "Name is too large"],
      },
    },
    title: {
      type: String,
      required: [true, "Please provide a title."],
      trim: true,
      minLength: [2, "Title must be at least 2 characters."],
      maxLength: [150, "Title is too large"],
    },
    img: {
      type: String,
      validate: [validator.isURL, "Please provide a valid url"],
      required: true,
    },
    post: {
      type: String,
      required: [true, "Please write a blog post."],
      minLength: [50, "Blog post is too small"],
    },
  },
  {
    timestamps: true,
  }
);
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
