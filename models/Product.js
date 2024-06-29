const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a Title of the Product"],
      trim: true,
      minLength: [2, "Name must be at least 2 characters."],
      maxLength: [150, "Name is too large"],
    },
    price: {
      type: String,
      required: [true, "Please provide price of the Product"],
      trim: true,
    },

    description: String,

    img: {
      type: String,
      validate: [validator.isURL, "Please provide a valid url"],
      required: true,
    },
    ratedBy: {
      type: String,
      trim: true,
    },
    bikeType: {
      type: String,
      trim: true,
      required: true,
      maxLength: [50, "Bike Type is too large"],
    },
    rating: {
      type: Number,
      required: true,
      min: [0, "Rating can't be negative"],
      max: [5, "Rating should be in range of 5"],
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
