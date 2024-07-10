const {
  signupService,
  findUserByEmail,
  findUserByToken,
  findAllUsersService,
  documentsCount,
  deleteUserService,
  updateUserService,
} = require("../services/user.service");
const { sendMailWithGmail } = require("../utils/email");
const { generateToken } = require("../utils/token");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await findAllUsersService();
    const totalCount = await documentsCount();
    res.status(200).json({
      status: "success",
      totalCount,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const user = await signupService(req.body);

    if (user) {
      const token = user.generateConfirmationToken();

      await user.save({ validateBeforeSave: false });

      const mailData = {
        to: [user.email],
        name: [user.name],
        subject: "Verify your Account",
        link: `${req.protocol}://${req.get("host")}/verify/${token}`,
      };

      await sendMailWithGmail(mailData);

      res.status(200).json({
        status: "success",
        message: "Successfully signed up",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: Object.keys(error).length ? error : error?.message,
    });
  }
};

/**
 * 1. Check if Email and password are given
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. send user and token
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        error: "No user found. Please create an account",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        error: "Password is not correct",
      });
    }

    if (user.status != "active") {
      return res.status(403).json({
        status: "fail",
        error: "Your account is not active yet.",
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

exports.getTokenExpiry = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const expiryTime = user.confirmationTokenExpires || 0;
    res.status(200).json({
      status: "success",
      expiryTime,
      confirmationTokenRequestCount: user?.confirmationTokenRequestCount || 0,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await findUserByEmail(req.user?.email);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await findUserByEmail(email);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: Object.keys(error).length ? error : error?.message,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const email = req.params.email;
    const update = req.body;
    const result = await updateUserService(email, update);
    res.status(200).json({
      status: "success",
      data: result,
      message: "User updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error?.message || error,
      message: "User updated failed due to error.",
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const query = req.query;
    const user = await deleteUserService(query);

    res.status(200).json({
      status: "success",
      data: user,
      message: "User deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: Object.keys(error).length ? error : error?.message,
    });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await findUserByToken(token);

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
        user: user,
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
        user: user,
      });
    }

    user.status = "active";
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;
    user.confirmationTokenRequestCount = 0;

    user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Verification success.",
      user: user,
    });
  } catch (error) {
    if (error.message === "No User found with the specified Token.") {
      res.status(404).json({
        status: "fail",
        error: error.message,
      });
    } else {
      res.status(500).json({
        status: "fail",
        error,
      });
    }
  }
};

exports.resendVerificationLink = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if (user.status === "active") {
      console.log(user.status);
      return res.status(400).json({
        status: "fail",
        message: "Account is already activated",
      });
    }

    const now = new Date(Date.now());
    const lastTokenSent =
      user.confirmationTokenCreated || new Date(Date.now()).getMinutes() + 10;
    const tokenRequestLimit = user.confirmationRequestCount || 0;

    if (tokenRequestLimit >= 2 && now - lastTokenSent < 24 * 60 * 60 * 1000) {
      console.log(now - lastTokenSent);
      return res.status(429).json({
        status: "fail",
        message:
          "You have reached the maximum number of resend attempts for today",
      });
    }

    if (now - lastTokenSent < 10 * 60 * 1000) {
      return res.status(429).json({
        status: "fail",
        message: "You can only request a new token every 10 minutes",
      });
    }

    const token = user.generateConfirmationToken();

    await user.save({ validateBeforeSave: false });

    const mailData = {
      to: [user.email],
      name: [user.name],
      subject: "Verify your Account",
      link: `${req.protocol}://${req.get("host")}/verify/${token}`,
    };

    await sendMailWithGmail(mailData);

    res.status(200).json({
      status: "success",
      message: "Verification link resent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
