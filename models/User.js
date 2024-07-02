const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
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
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 1,
          }),
        message:
          "Password {VALUE} is not strong enough. Password length should be At Least 6 character and one of each is mandatory(uppercase, lowercase, number and symbol)!",
      },
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords doesn't match!",
      },
    },

    role: {
      type: String,
      enum: ["user", "store-manager", "admin"],
      default: "user",
    },
    name: {
      type: String,
      required: [true, "Please provide a Name"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters."],
      maxLength: [100, "Name is too large"],
    },
    contactNumber: {
      type: String,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid contact number",
      ],
    },

    shippingAddress: String,

    photoURL: {
      type: String,
      validate: [validator.isURL, "Please provide a valid url"],
    },
    status: {
      type: String,
      default: "inactive",
      enum: ["active", "inactive", "blocked"],
    },
    confirmationToken: String,
    confirmationTokenCreated: Date,
    confirmationTokenExpires: Date,
    confirmationTokenRequestCount: { type: Number, default: 0 },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    //  only run if password is modified, otherwise it will change every time we save the user!
    return next();
  }
  const password = this.password;

  const hashedPassword = bcrypt.hashSync(password);

  this.password = hashedPassword;
  this.confirmPassword = undefined;

  next();
});

userSchema.methods.comparePassword = function (password, hash) {
  const isPasswordValid = bcrypt.compareSync(password, hash);
  return isPasswordValid;
};

userSchema.methods.generateConfirmationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.confirmationToken = token;

  const date = new Date();
  const currentDate = Date.now();
  this.confirmationTokenCreated = currentDate;
  if (this.confirmationTokenRequestCount < 3) {
    this.confirmationTokenExpires = Date.now() + 10 * 60 * 1000;
    this.confirmationTokenRequestCount++;
  } else {
    this.confirmationTokenRequestCount = 0;
    this.confirmationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  }

  return token;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
