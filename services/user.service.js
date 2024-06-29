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
  return await User.findOne({ email });
};

exports.findUserByToken = async (token) => {
  return await User.findOne({ confirmationToken: token });
};
