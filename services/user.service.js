const User = require("../models/User");

exports.findAllUsersService = async () => {
  const users = await User.find({});
  return users;
};
exports.documentsCount = async () => {
  try {
    let totalCount = await User.countDocuments().exec();
    return totalCount;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.signupService = async (userInfo) => {
  const user = await User.create(userInfo);
  return user;
};

exports.findUserByEmail = async (email) => {
  try {
    const result = await User.findOne({ email }).exec();
    if (!result) {
      throw new Error("No User found with the specified email.");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

exports.findUserByToken = async (token) => {
  try {
    const result = await User.findOne({ confirmationToken: token }).exec();
    if (!result) {
      throw new Error("No User found with the specified Token.");
    }
    return result;
  } catch (error) {
    throw error;
  }
};
exports.deleteUserService = async (query) => {
  try {
    const result = await User.findOneAndDelete(query).exec();
    if (!result) {
      throw new Error("No User found with the specified query.");
    }
    return result;
  } catch (error) {
    throw error;
  }
};
