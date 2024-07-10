const mongoose = require("mongoose");
const validator = require("validator");

const newsletterSchema = mongoose.Schema(
  {
    email: {
      type: String,
      validate: [validator.isEmail, "Provide a valid Email."],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: async function (email) {
          const user = await this.constructor.findOne({ email });
          if (user) {
            if (this._id === user._id) {
              return true;
            }
            return false;
          }
          return true;
        },
        message: (props) => "The specified email address is already in use.",
      },
      required: [true, "Email is required."],
    },
    status: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: "subscribed",
    },
  },
  {
    timestamps: true,
  }
);
const NewsletterSubscriber = mongoose.model(
  "NewsletterSubscriber",
  newsletterSchema
);
module.exports = NewsletterSubscriber;
