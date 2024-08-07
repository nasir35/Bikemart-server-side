const { Schema, default: mongoose } = require("mongoose");
const validator = require("validator");

const OrderSchema = new Schema(
  {
    buyer: {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      email: {
        type: String,
        validate: [validator.isEmail, "Please provide your email."],
        required: true,
      },
      name: {
        type: String,
        required: [true, "Please provide a Name"],
        trim: true,
        minLength: [3, "Name must be at least 3 characters."],
        maxLength: [100, "Name is too large"],
      },
      phone: {
        type: String,
        required: [true, "please provide your phone number!"],
      },
      shippingAddress: {
        type: String,
        required: [true, "Please provide shipping address!"],
      },
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: String, required: true },
        img: {
          type: String,
          validate: [validator.isURL, "Please provide a valid URL."],
          required: true,
        },
        type: { type: String, required: true },
        quantity: Number,
      },
    ],
    status: {
      type: String,
      enum: [
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Request Cancel",
        "Cancelled",
        "Returned",
        "Refunded",
      ],
      default: "Processing",
    },
    buyerMessage: String,
    sellerMessage: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
