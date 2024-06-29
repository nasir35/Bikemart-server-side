const mongoose = require("mongoose");
const validator = require("validator");

const reviewSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name."],
      trim: true,
      minLength: [2, "Name must be at least 2 characters."],
      maxLength: [50, "Name is too large"],
    },
    profession: {
      type: String,
      required: [true, "Please include your profession."],
      trim: true,
      minLength: [2, "Name must be at least 2 characters."],
      maxLength: [50, "Name is too large"],
    },

    review: {
      type: String,
      required: [true, "Please write a review."],
      trim: true,
    },

    img: {
      type: String,
      validate: [validator.isURL, "Please provide a valid url"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [0, "Rating can't be negative"],
      max: [5, "Rating should be in range of 5"],
    },
    reviewStatus: {
      type: String,
      enum: ["Pending", "Published"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
